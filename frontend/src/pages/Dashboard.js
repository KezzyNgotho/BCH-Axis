// src/InteractiveDashboard.js
import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, PresentationControls, Html } from '@react-three/drei';
import { Box, Typography, Card, Grid, Container, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Button, Toolbar, AppBar } from '@mui/material';
import { FaWallet, FaArrowRight, FaBars } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import * as THREE from 'three';

const themeColors = {
  primary: '#1D546C',
  secondary: '#4DA6FF',
  accent: '#FFD700',
};

const drawerWidth = 240;

const InteractiveDashboard = ({ wallet, vaults, transactions }) => {
  const [btcPrice, setBtcPrice] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [animatedTransactions, setAnimatedTransactions] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [localVaults, setLocalVaults] = useState(vaults || []);

  useEffect(() => {
    const fetchBchPrice = async () => {
      try {
        const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
        setBtcPrice(res.data['bitcoin-cash'].usd);
      } catch (err) {
        console.error('Error fetching BCH price:', err);
      }
    };
    fetchBchPrice();
    const interval = setInterval(fetchBchPrice, 10000);
    return () => clearInterval(interval);
  }, []);

  // Load contracts and vaults from backend
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [cRes, vRes] = await Promise.all([
          axios.get('/api/contracts'),
          axios.get('/api/vault')
        ]);
        if (!mounted) return;
        setContracts(cRes.data || []);
        const vs = Array.isArray(vRes.data) ? vRes.data : [];
        // Fetch utxos for each vault to compute balances
        const vaultsWithBalances = await Promise.all(vs.map(async (v) => {
          try {
            const ut = await axios.get(`/api/vault/${v.id}/utxos`);
            const utxos = ut.data || [];
            const sats = utxos.reduce((s, u) => s + (u.satoshis || 0), 0);
            return { ...v, utxos, balance: (sats / 1e8) };
          } catch (e) {
            return { ...v, utxos: [], balance: 0 };
          }
        }));
        setLocalVaults(vaultsWithBalances);
      } catch (err) {
        console.warn('Could not load contracts or vaults:', err && err.message ? err.message : err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Animate new transactions
  useEffect(() => {
    const newTxs = transactions.filter(tx => !animatedTransactions.some(a => a.id === tx.id));
    if (newTxs.length > 0) setAnimatedTransactions(prev => [...prev, ...newTxs]);
  }, [transactions]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: themeColors.primary,
            color: '#fff',
            borderRight: 'none',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" fontWeight="bold">BCH Axis</Typography>
        </Toolbar>
        <List>
          {['Dashboard', 'Vaults', 'Transactions', 'Settings', 'Analytics'].map(text => (
            <ListItemButton key={text} sx={{ '&:hover': { bgcolor: themeColors.secondary } }}>
              <ListItemIcon><FaArrowRight style={{ color: 'white' }} /></ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5faff', position: 'relative', ml: sidebarOpen ? `${drawerWidth}px` : 0 }}>
        {/* 3D Canvas Background */}
        <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} />

          <PresentationControls global config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 2000 }} rotation={[0, 0.2, 0]}>
            {/* Floating BCH coins */}
            {[...Array(10)].map((_, idx) => (
              <Float key={idx} speed={2 + Math.random() * 2} rotationIntensity={1} floatIntensity={2} floatingRange={[1, 3]}>
                <mesh position={[Math.random() * 20 - 10, Math.random() * 10, Math.random() * -5]}>
                    <torusGeometry args={[0.3, 0.15, 16, 100]} />
                  <meshStandardMaterial color={themeColors.accent} metalness={0.8} roughness={0.2} />
                  <Html center distanceFactor={2}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                      ${btcPrice}
                    </Typography>
                  </Html>
                </mesh>
              </Float>
            ))}

            {/* Vault icons */}
            {localVaults.map((vault, idx) => (
              <Float key={vault.id} speed={1 + Math.random()} rotationIntensity={2} floatIntensity={1.5}>
                <mesh position={[idx * 2 - 5, 2, -5]} onPointerOver={e => e.object.scale.set(1.5, 1.5, 1.5)} onPointerOut={e => e.object.scale.set(1, 1, 1)}>
                    <boxGeometry args={[0.8, 0.8, 0.8]} />
                  <meshStandardMaterial color={themeColors.primary} metalness={0.6} roughness={0.4} />
                  <Html distanceFactor={1.5} center>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                      {vault.name}
                    </Typography>
                  </Html>
                </mesh>
              </Float>
            ))}

            {/* Animated transaction flows */}
            {animatedTransactions.map((tx, idx) => (
              <Float key={tx.id} speed={0} floatIntensity={0}>
                <mesh position={[-5, 0, -5]} onUpdate={self => {
                  const target = vaults.find(v => v.id === tx.vaultId);
                  if (target) {
                    const t = 0.02;
                    self.position.lerp(new THREE.Vector3(idx * 2 - 5, 2, -5), t);
                  }
                }}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                  <meshStandardMaterial color={themeColors.secondary} metalness={0.9} roughness={0.1} />
                  <Html distanceFactor={1} center>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {tx.amount} BCH
                    </Typography>
                  </Html>
                </mesh>
              </Float>
            ))}
          </PresentationControls>

          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>

        {/* Top App Bar */}
        <AppBar position="sticky" sx={{ bgcolor: themeColors.primary, zIndex: 2 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FaBars size={24} onClick={toggleSidebar} style={{ cursor: 'pointer' }} />
              <Typography variant="h6" fontWeight="bold">BCH Axis</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Typography>Wallet: {wallet.address.slice(0, 6)}...{wallet.address.slice(-6)}</Typography>
              <Typography>Balance: {wallet.balance} BCH</Typography>
              <Button variant="contained" color="warning" onClick={() => console.log('Disconnect')}>Disconnect</Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <motion.div whileHover={{ scale: 1.03 }}>
                <Card sx={{ p: 3, borderLeft: `6px solid ${themeColors.primary}`, borderRadius: 2, boxShadow: 4 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <FaWallet size={28} color={themeColors.primary} />
                    <Typography variant="h6" fontWeight="bold">Wallet Overview</Typography>
                  </Box>
                  <Typography variant="body2" mt={1} sx={{ wordBreak: 'break-all' }}>Address: {wallet?.address || '—'}</Typography>
                  <Typography variant="subtitle1" mt={1}>Balance: {wallet?.balance ?? '—'} BCH (~${wallet?.fiat ?? '—'})</Typography>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={8}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card sx={{ p: 3, borderRadius: 2, boxShadow: 4 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>Transaction Trends</Typography>
                  <ul>
                    {transactions && transactions.length ? transactions.map(tx => (
                      <li key={tx.id}>{tx.date}: {tx.amount} BCH</li>
                    )) : <li>No transactions yet</li>}
                  </ul>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Footer */}
          <Box mt={6} py={4} bgcolor="#07212a" textAlign="center" color="white">
            <Typography fontWeight="bold">© 2025 BCH Axis. All Rights Reserved.</Typography>
            <Box mt={1} display="flex" justifyContent="center" gap={3}>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Twitter</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>LinkedIn</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>GitHub</a>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default InteractiveDashboard;
