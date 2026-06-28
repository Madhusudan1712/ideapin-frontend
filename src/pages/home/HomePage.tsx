import React, { useRef, useLayoutEffect } from 'react';
import { Grid, Typography, Card, CardContent, Box, Button } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SyncIcon from '@mui/icons-material/Sync';
import PushPinIcon from '@mui/icons-material/PushPin';
import { useSearchParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import gsap from 'gsap';

/**
 * Landing page of ideapin offering platform introductions and core feature outlines.
 */
export const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Intro headers animations
      gsap.from('.intro-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
      gsap.from('.intro-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
      });
      gsap.from('.intro-cta', {
        scale: 0.85,
        opacity: 0,
        duration: 0.5,
        delay: 0.3,
        ease: 'back.out(1.7)',
      });

      // Cards staggered enter
      gsap.from(cardsRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        delay: 0.4,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Scroll or highlight features section if tab is clicked
  useLayoutEffect(() => {
    if (activeTab === 'features') {
      const featuresEl = document.getElementById('features-section');
      if (featuresEl) {
        featuresEl.scrollIntoView({ behavior: 'smooth' });
        gsap.fromTo(
          featuresEl,
          { backgroundColor: 'var(--accent-bg)', borderRadius: '16px' },
          { backgroundColor: 'transparent', duration: 1.5, ease: 'power2.out' }
        );
      }
    }
  }, [activeTab]);

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardsRef.current[index] = el;
  };

  const features = [
    {
      title: 'Private & Public Ideas',
      description: 'Keep your personal thoughts secure in private notes, or publish them to the community feed to share your developer insights.',
      icon: LockOpenIcon,
    },
    {
      title: 'Real-Time Pinning',
      description: 'Pin your most important code snippets, links, or outlines to the top of your workspace for instant visual access.',
      icon: PushPinIcon,
    },
    {
      title: 'Offline-First Sync Engine',
      description: 'Built with dynamic batch operations and Last-Write-Wins (LWW) conflict resolution to keep your ideas saved offline and synced seamlessly.',
      icon: SyncIcon,
    },
  ];

  return (
    <DashboardLayout>
      <Box ref={containerRef} sx={{ width: '100%', py: { xs: 4, md: 8 }, px: { xs: 2, md: 6 }, boxSizing: 'border-box' }}>
        {/* Hero Section */}
        {activeTab === 'overview' && (
          <Box sx={{ textAlign: 'center', mb: 8, mt: 2 }}>
            <Typography
              className="intro-title"
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.2rem', md: '3.2rem' },
                color: 'var(--text-h)',
                mb: 2.5,
                letterSpacing: '-1px',
              }}
            >
              Capture, Organize & Share Your{' '}
              <span style={{ color: 'var(--accent)' }}>Developer Ideas</span>
            </Typography>
            <Typography
              className="intro-subtitle"
              variant="body1"
              sx={{
                color: 'var(--text)',
                fontSize: { xs: '1.05rem', md: '1.25rem' },
                lineHeight: 1.6,
                maxWidth: 720,
                mx: 'auto',
                mb: 4.5,
              }}
            >
              ideapin is a developer-centric space designed to manage your snippets, notes, and public outlines. Powered by Supabase security and clean API integrations.
            </Typography>
            <Box className="intro-cta" sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                component={Link}
                to="/mynotes"
                variant="contained"
                sx={{
                  backgroundColor: 'var(--accent)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  px: 4,
                  py: 1.25,
                  borderRadius: 2.5,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: 'var(--accent)',
                    opacity: 0.9,
                    boxShadow: 'none',
                  },
                }}
              >
                Go to Workspace
              </Button>
              <Button
                component={Link}
                to="/feed"
                variant="outlined"
                sx={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-h)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  px: 4,
                  py: 1.25,
                  borderRadius: 2.5,
                  '&:hover': {
                    borderColor: 'var(--accent)',
                    backgroundColor: 'var(--accent-bg)',
                  },
                }}
              >
                Explore Feed
              </Button>
            </Box>
          </Box>
        )}

        {/* Features Grid */}
        <Box id="features-section" sx={{ p: 2, transition: 'background-color 0.5s' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 4,
              mt: activeTab === 'features' ? 2 : 0,
              textAlign: 'center',
              color: 'var(--text-h)',
            }}
          >
            Core Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Grid size={{ xs: 12, md: 4 }} key={idx}>
                  <Box ref={setCardRef(idx)} sx={{ height: '100%' }}>
                    <Card
                      sx={{
                        height: '100%',
                        border: '1px solid var(--border)',
                        borderRadius: 3,
                        boxShadow: 'none',
                        backgroundColor: 'var(--bg)',
                        transition: 'transform 0.2s, border-color 0.2s',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          borderColor: 'var(--accent-border)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-bg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            color: 'var(--accent)',
                          }}
                        >
                          <Icon sx={{ fontSize: 28 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{ fontWeight: 600, mb: 1.5, color: 'var(--text-h)' }}
                        >
                          {feat.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'var(--text)', lineHeight: 1.6 }}
                        >
                          {feat.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default HomePage;
