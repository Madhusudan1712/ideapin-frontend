import React, { useState, useRef, useLayoutEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Collapse,
    IconButton,
    Divider,
} from "@mui/material";
import { Icon } from "@iconify/react";
import gsap from "gsap";

import styles from "./auth.module.scss";
import { id, socialProviders, type SocialProvider } from "./socialProviders";
import { supabase } from "../../config/auth/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const WELCOME_MESSAGES = [
    "Welcome Back",
    "Glad to See You",
    "Hello Again",
    "Welcome Home",
    "Nice to See You",
    "Good to See You Again",
    "Great to Have You Back",
    "Ready to Dive In?",
    "Wonderful to See You"
];

const Auth: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(true);
    const [welcomeMessage] = useState(() => {
        const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
        return WELCOME_MESSAGES[randomIndex];
    });

    const from = (location.state as any)?.from?.pathname || "/home";

    React.useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const decorRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Background shapes entrance
            if (decorRef.current) {
                tl.fromTo(
                    decorRef.current.querySelectorAll(".decorShape"),
                    {
                        opacity: 0,
                        scale: 0.6,
                        filter: "blur(40px)",
                    },
                    {
                        opacity: 0.15,
                        scale: 1,
                        filter: "blur(60px)",
                        duration: 1.2,
                        stagger: 0.2,
                        ease: "power2.out",
                    },
                    0
                );
            }

            // Title entrance
            if (titleRef.current) {
                tl.fromTo(
                    titleRef.current,
                    {
                        opacity: 0,
                        y: 30,
                        filter: "blur(8px)",
                    },
                    {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 0.8,
                        ease: "power3.out",
                    },
                    0.2
                );
            }

            // Subtitle entrance
            if (subtitleRef.current) {
                tl.fromTo(
                    subtitleRef.current,
                    {
                        opacity: 0,
                        y: 20,
                        filter: "blur(6px)",
                    },
                    {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 0.8,
                        ease: "power3.out",
                    },
                    0.35
                );
            }

            // Card entrance
            if (cardRef.current) {
                tl.fromTo(
                    cardRef.current,
                    {
                        opacity: 0,
                        y: 35,
                        scale: 0.96,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: "back.out(1.2)",
                    },
                    0.45
                );
            }

            // Continuous floating decoration animation
            gsap.to(".floatingDecor", {
                y: -15,
                rotation: 6,
                duration: 4.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.4,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleSocialLogin = async (provider: SocialProvider["id"]) => {
        switch (provider) {
            case id.GOOGLE: {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: id.GOOGLE,
                    options: {
                        redirectTo: window.location.origin
                    }
                });

                if (error) {
                    console.error("Login error:", error.message);
                }
                break;
            }
            case id.GITHUB: {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: id.GITHUB,
                    options: {
                        redirectTo: window.location.origin
                    }
                });

                if (error) {
                    console.error("Login error:", error.message);
                }
                break;
            }
            default: {
                console.log(provider);
            }
        }
    };

    return (
        <Box ref={containerRef} className={styles.container}>
            {/* Background Decorative Shapes */}
            <Box ref={decorRef} className={styles.decor}>
                <Box className={`${styles.decorShape} ${styles.shape1} decorShape floatingDecor`} />
                <Box className={`${styles.decorShape} ${styles.shape2} decorShape floatingDecor`} />
            </Box>

            <Box className={styles.content}>
                <Typography
                    ref={titleRef}
                    variant="h3"
                    className={styles.title}
                >
                    {welcomeMessage}
                </Typography>

                <Typography
                    ref={subtitleRef}
                    className={styles.subtitle}
                >
                    Connect with one of our secure social providers to proceed.
                </Typography>

                <Paper
                    ref={cardRef}
                    elevation={0}
                    className={styles.socialCard}
                >
                    <Box
                        className={styles.header}
                        onClick={() => setOpen((prev) => !prev)}
                        role="button"
                        aria-expanded={open}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                setOpen((prev) => !prev);
                            }
                        }}
                    >
                        <Typography className={styles.headerTitle}>
                            Sign in with your social account
                        </Typography>

                        <IconButton
                            size="small"
                            aria-label={open ? "Collapse list" : "Expand list"}
                        >
                            <Icon
                                icon={
                                    open
                                        ? "mdi:chevron-up"
                                        : "mdi:chevron-down"
                                }
                                width={22}
                            />
                        </IconButton>
                    </Box>

                    <Collapse in={open}>
                        {socialProviders.map((provider, index) => (
                            <React.Fragment key={provider.id}>
                                <Box
                                    className={`${styles.socialItem} ${styles[provider.id]}`}
                                    onClick={() => handleSocialLogin(provider.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            handleSocialLogin(provider.id);
                                        }
                                    }}
                                >
                                    <Box className={styles.iconWrapper}>
                                        <Icon icon={provider.icon} width={28} />
                                    </Box>

                                    <Typography className={styles.socialText}>
                                        {provider.label}
                                    </Typography>
                                </Box>

                                {index !== socialProviders.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </Collapse>
                </Paper>
            </Box>
        </Box>
    );
};

export default Auth;