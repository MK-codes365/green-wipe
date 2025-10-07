'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Users, Recycle, Globe, Fingerprint, BookCopy, Usb, CheckSquare, Scale, Loader2, GitMerge, Network, Server, ClipboardList, Bot, ShieldAlert, Smartphone, Gauge, CalendarClock, Share2, ServerCog, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/ui/logo';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/components/user-profile';


const initialContent = {
    hero: {
        title: "Secure Data Erasure for a Greener Planet.",
        subtitle: "Green Wipe provides verifiable, compliant, and eco-friendly data sanitization solutions for everyone, from individuals to nations.",
        getStarted: "Get Started"
    },
    features: {
        title: "Features at a Glance",
        items: [
            {
              icon: "Scale",
              title: "NIST SP 800-88 Compliance",
              description: "Fully compliant with NIST guidelines for secure media sanitization.",
            },
            {
              icon: "ShieldAlert",
              title: "DoD / Gutmann Methods",
              description: "Supports multiple advanced wiping algorithms for maximum security.",
            },
             {
              icon: "ShieldCheck",
              title: "SSD Secure Erasure",
              description: "Uses manufacturer-specific commands for reliable SSD data destruction.",
            },
            {
              icon: "ServerCog",
              title: "HPA/DCO Hidden Area Wiping",
              description: "Erases data from locked and hidden areas of a hard drive.",
            },
            {
              icon: "Link2",
              title: "Blockchain-Anchored Certificates",
              description: "Creates a permanent, tamper-proof record of the wipe certificate on a public blockchain."
            },
             {
              icon: "ClipboardList",
              title: "Automatic Audit Trails",
              description: "Generate detailed, tamper-proof logs for compliance and reporting.",
            },
            {
                icon: "Server",
                title: "Master-Slave Architecture",
                description: "Supports parallel bulk wiping for large-scale operations.",
            },
            {
              icon: "Fingerprint",
              title: "One-Click Simple UI",
              description: "An intuitive interface makes secure wiping accessible to everyone.",
            },
            {
              icon: "Gauge",
              title: "Real-Time Progress Tracker",
              description: "Monitor the status and progress of every wipe operation in real-time.",
            },
            {
              icon: "Usb",
              title: "Bootable USB/ISO (Offline)",
              description: "Create bootable media to wipe systems without an operating system.",
            },
            {
              icon: "Smartphone",
              title: "Android Integration",
              description: "Securely wipe your Android devices with ease.",
            },
            {
              icon: "Share2",
              title: "API / Enterprise Integration",
              description: "Integrate Green Wipe into your existing IT asset disposal workflows.",
            },
             {
              icon: "CalendarClock",
              title: "Automated Scheduling / Reports",
              description: "Schedule wipes and generate recurring reports automatically.",
            },
        ]
    },
    userSegments: {
        title: "Who We Serve",
        items: [
            {
                icon: "Users",
                title: 'General Users',
                description: 'Overcome data theft fears, recycle safely with one-click UI & wipe certificates.',
            },
            {
                icon: "Recycle",
                title: 'Corporates/SMEs',
                description: 'Ensure compliance, simplify IT asset disposal, reduce breach liability.',
            },
            {
                icon: "Globe",
                title: 'ITADs/Recyclers',
                description: 'Parallel bulk wiping with master–slave model; blockchain builds client trust.',
            },
        ]
    },
    platform: {
      title: "Available on All Your Devices",
      description: "Secure your data on any platform. Green Wipe provides a consistent and reliable experience everywhere.",
      buttons: [
        { name: "Windows", icon: "Windows", href: "#" },
        { name: "Linux", icon: "Linux", href: "#" },
        { name: "Android", icon: "Android", href: "#" },
      ]
    },
    techStack: {
        title: "Powered by a Modern Tech Stack",
        items: [
            { name: 'Next.js' },
            { name: 'React' },
            { name: 'ShadCN UI' },
            { name: 'Tailwind CSS' },
            { name: 'Genkit' },
        ]
    },
    finalCta: {
        title: "Ready to Wipe Securely?",
        subtitle: "Join the movement towards responsible electronics recycling and data security.",
        button: "Wipe Your First File"
    },
    footer: {
        get_to_know_us: "Get to Know Us",
        about: "About Green Wipe",
        careers: "Careers",
        press_releases: "Press Releases",
        science: "Green Wipe Science",
        connect: "Connect with Us",
        facebook: "Facebook",
        twitter: "Twitter",
        instagram: "Instagram",
        make_money: "Make Money with Us",
        sell_on: "Sell on Green Wipe",
        sell_under: "Sell under Green Wipe Accelerator",
        protect_brand: "Protect and Build Your Brand",
        global_selling: "Green Wipe Global Selling",
        affiliate: "Become an Affiliate",
        fulfilment: "Fulfilment by Green Wipe",
        advertise: "Advertise Your Products",
        let_us_help: "Let Us Help You",
        your_account: "Your Account",
        returns_centre: "Returns Centre",
        purchase_protection: "100% Purchase Protection",
        app_download: "Green Wipe App Download",
        help: "Help",
        language_placeholder: "Language",
        country_placeholder: "Country",
        copyright: `© ${new Date().getFullYear()} Green Wipe. All rights reserved.`
    }
};

const iconMap: { [key: string]: React.ReactNode } = {
    ShieldCheck: <ShieldCheck className="w-10 h-10 text-primary" />,
    BookCopy: <BookCopy className="w-10 h-10 text-primary" />,
    Fingerprint: <Fingerprint className="w-10 h-10 text-primary" />,
    Usb: <Usb className="w-10 h-10 text-primary" />,
    CheckSquare: <CheckSquare className="w-10 h-10 text-primary" />,
    Scale: <Scale className="w-10 h-10 text-primary" />,
    Users: <Users className="w-10 h-10 text-green-400" />,
    Recycle: <Recycle className="w-10 h-10 text-blue-400" />,
    Globe: <Globe className="w-10 h-10 text-purple-400" />,
    GitMerge: <GitMerge className="w-10 h-10 text-primary" />,
    Network: <Network className="w-10 h-10 text-primary" />,
    Server: <Server className="w-10 h-10 text-primary" />,
    ClipboardList: <ClipboardList className="w-10 h-10 text-primary" />,
    Bot: <Bot className="w-10 h-10 text-primary" />,
    ShieldAlert: <ShieldAlert className="w-10 h-10 text-primary" />,
    Smartphone: <Smartphone className="w-10 h-10 text-primary" />,
    Gauge: <Gauge className="w-10 h-10 text-primary" />,
    CalendarClock: <CalendarClock className="w-10 h-10 text-primary" />,
    Share2: <Share2 className="w-10 h-10 text-primary" />,
    ServerCog: <ServerCog className="w-10 h-10 text-primary" />,
    Link2: <Link2 className="w-10 h-10 text-primary" />,
};

const platformIcons: { [key: string]: React.ReactNode } = {
    Windows: <svg role="img" width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Windows</title><path d="M0 3.525L9.838 2.062v9.64H0V3.525zM10.826 2v9.705H24V0L10.826 2zM0 12.295h9.838v9.64L0 20.475v-8.18zM10.826 12.295H24V24l-13.174-2.062v-9.643z" fill="currentColor"/></svg>,
    Linux: <svg style={{color: "rgb(47, 241, 9)"}} width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7.1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9.6 7.9 1.2 11.8 1.2 8.1 2.5 15.7.8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1.6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3.4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4.7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6.6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7.8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4.6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1.8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7.4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6.8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1.3-.2.7-.3 1-.5.8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z" fill="currentColor"></path></svg>,
    Android: <svg style={{ color: "rgb(53, 243, 56)" }} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="32" zoomAndPan="magnify" viewBox="0 0 30 30.000001" height="32" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="id1"><path d="M 7.703125 3.199219 L 22.21875 3.199219 L 22.21875 26.421875 L 7.703125 26.421875 Z M 7.703125 3.199219 " clipRule="nonzero" fill="#35f338"></path></clipPath></defs><g clipPath="url(#id1)"><path fill="currentColor" d="M 7.703125 18.820312 C 7.703125 22.902344 10.949219 26.207031 14.960938 26.207031 C 18.972656 26.207031 22.21875 22.902344 22.21875 18.820312 L 22.21875 14.601562 L 7.703125 14.601562 Z M 19.234375 6.550781 L 21.410156 4.332031 L 20.5625 3.457031 L 18.175781 5.894531 C 17.203125 5.398438 16.125 5.105469 14.960938 5.105469 C 13.800781 5.105469 12.722656 5.398438 11.757812 5.894531 L 9.363281 3.457031 L 8.511719 4.332031 L 10.691406 6.550781 C 8.886719 7.890625 7.703125 10.042969 7.703125 12.488281 L 7.703125 13.542969 L 22.21875 13.542969 L 22.21875 12.488281 C 22.21875 10.042969 21.039062 7.890625 19.234375 6.550781 Z M 11.851562 11.433594 C 11.28125 11.433594 10.8125 10.960938 10.8125 10.378906 C 10.8125 9.800781 11.28125 9.324219 11.851562 9.324219 C 12.421875 9.324219 12.886719 9.800781 12.886719 10.378906 C 12.886719 10.960938 12.421875 11.433594 11.851562 11.433594 Z M 18.074219 11.433594 C 17.503906 11.433594 17.035156 10.960938 17.035156 10.378906 C 17.503906 9.324219 18.074219 9.324219 C 18.644531 9.324219 19.109375 9.800781 19.109375 10.378906 C 19.109375 10.960938 18.644531 11.433594 18.074219 11.433594 Z M 18.074219 11.433594 " fillOpacity="1" fillRule="nonzero"></path></g></svg>,
    GitHub: <svg role="img" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor"/></svg>,
    Twitter: <svg role="img" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" fill="currentColor"/></svg>,
    Google: <svg role="img" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 1.9-5.12 1.9-4.4 0-7.9-3.64-7.9-8.14s3.5-8.14 7.9-8.14c2.5 0 4.13.98 5.42 2.23l2.66-2.66C18.28 1.14 15.79 0 12.48 0 5.86 0 .32 5.36.32 12s5.54 12 12.16 12c3.12 0 5.64-1.02 7.4-2.72 1.84-1.72 2.5-4.35 2.5-6.92 0-.6-.08-1.2-.18-1.8z" fill="currentColor"/></svg>,
};

const techStackIcons: { [key: string]: React.ReactNode } = {
    'Next.js': <svg width="64" height="64" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"><g transform="translate(.722 .64) scale(6.375)"><circle cx="40" cy="40" r="40" fill="black"></circle><path d="M66.448 70.009L30.73 24H24v31.987h5.384v-25.15l32.838 42.427a40.116 40.116 0 004.226-3.255z" fill="url(#prefix__Linear1)" fillRule="nonzero"></path><path fill="url(#prefix__Linear2)" d="M51.111 24h5.333v32h-5.333z"></path></g><defs><linearGradient id="prefix__Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(51.103 -29.93 76.555) scale(25.1269)"><stop offset="0" stopColor="#fff"></stop><stop offset="1" stopColor="#fff" stopOpacity="0"></stop></linearGradient><linearGradient id="prefix__Linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90.218 14.934 38.787) scale(23.50017)"><stop offset="0" stopColor="#fff"></stop><stop offset="1" stopColor="#fff" stopOpacity="0"></stop></linearGradient></defs></svg>,
    'React': <svg width="64" height="64" viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="0" cy="0" r="2.05" fill="#61DAFB"/><g stroke="#61DAFB" strokeWidth="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>,
    'ShadCN UI': <svg width="64" height="64" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H256V256H0V0Z" fill="black"/><path d="M128.001 25.6001L230.401 89.6001V217.6L128.001 153.6L25.6006 217.6V89.6001L128.001 25.6001Z" stroke="white" strokeWidth="20" strokeLinejoin="round"/></svg>,
    'Tailwind CSS': <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4.66666C10.3 4.66666 5.66669 9.3 5.66669 15C5.66669 18.2333 7.33335 21.0667 9.83335 22.85C9.53335 22.8 9.33335 22.5667 9.33335 22.25C9.33335 21.8333 9.68335 21.5 10.1 21.5C10.5334 21.5 10.8667 21.85 10.8667 22.25C10.8667 22.5667 10.6667 22.8 10.3667 22.85C11.9667 24.3 13.9167 25.3333 16 25.3333C21.7 25.3333 26.3334 20.7 26.3334 15C26.3334 9.3 21.7 4.66666 16 4.66666ZM16 22.6667C11.7667 22.6667 8.33335 19.2333 8.33335 15C8.33335 10.7667 11.7667 7.33332 16 7.33332C20.2334 7.33332 23.6667 10.7667 23.6667 15C23.6667 19.2333 20.2334 22.6667 16 22.6667Z" fill="#38BDF8"/><path d="M10.1 11.3333C8.95002 11.3333 8.00002 12.2833 8.00002 13.4333C8.00002 14.5833 8.95002 15.5333 10.1 15.5333C11.25 15.5333 12.2 14.5833 12.2 13.4333C12.2 12.2833 11.25 11.3333 10.1 11.3333ZM21.9 11.3333C20.75 11.3333 19.8 12.2833 19.8 13.4333C19.8 14.5833 20.75 15.5333 21.9 15.5333C23.05 15.5333 24 14.5833 24 13.4333C24 12.2833 23.05 11.3333 21.9 11.3333Z" fill="#38BDF8"/></svg>,
    'Genkit': <svg width="64" height="64" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0002 0.5L20.0002 8C15.5819 8 12.0002 11.5817 12.0002 16L4.00018 16C4.00018 7.42157 11.1926 0.5 20.0002 0.5Z" fill="#4285F4"></path><path d="M20.0001 40.5L20.0001 33C24.4184 33 28.0001 29.4183 28.0001 25H36.0001C36.0001 33.5784 28.8076 40.5 20.0001 40.5Z" fill="#34A853"></path><path d="M0 20.5C0 20.5 7.19239 20.5 16 20.5C16 16.0817 12.4183 12.5 8 12.5L8 4.5C16.5784 4.5 24 11.6924 24 20.5C24 29.3076 16.5784 36.5 8 36.5L8 28.5C12.4183 28.5 16 24.9183 16 20.5Z" fill="#F9BC05"></path><path d="M40 20.5C40 20.5 32.8076 20.5 24 20.5C24 24.9183 27.5817 28.5 32 28.5L32 36.5C23.4216 36.5 16 29.3076 16 20.5C16 11.6924 23.4216 4.5 32 4.5L32 12.5C27.5817 12.5 24 16.0817 24 20.5Z" fill="#EA4335"></path></svg>
};

export default function HomePage() {
  const [content, setContent] = useState(initialContent);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {isTranslating && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        <Link href="/" className="group">
            <Logo className="h-12 w-auto logo-float" />
        </Link>
        <div className="flex items-center gap-4">
            <div id="google_translate_element"></div>
            <UserProfile />
        </div>
      </header>
      <main className="content-fade-in">
        {/* Hero Section */}
        <section className="text-center py-20 px-4 md:py-32">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-green-400 to-blue-400 pb-4">
                {content.hero.title}
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg md:text-xl text-muted-foreground">
                {content.hero.subtitle}
            </p>
            <div className="mt-8">
                <Button asChild size="lg" className="group">
                    <Link href="/dashboard">
                        <>
                            {content.hero.getStarted}{' '}
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                    </Link>
                </Button>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-secondary/20">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">{content.features.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {content.features.items.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-card/50 backdrop-blur-sm p-8 rounded-xl shadow-lg md:hover:shadow-primary/20 md:hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center border border-border/20"
                        >
                            <div className="mb-4 text-primary">
                                {iconMap[feature.icon]}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Who We Serve Section */}
        <section className="py-16 px-4">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">{content.userSegments.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {content.userSegments.items.map((segment, index) => (
                        <Card key={index} className="bg-card/50 backdrop-blur-sm p-8 rounded-xl shadow-lg md:hover:shadow-primary/20 md:hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center border border-border/20">
                           <CardContent className="flex flex-col items-center text-center p-0">
                                <div className="mb-4">{iconMap[segment.icon]}</div>
                                <CardTitle as="h3" className="text-xl font-bold mb-2">{segment.title}</CardTitle>
                                <p className="text-muted-foreground">{segment.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Cross-Platform Section */}
        <section className="py-16 px-4">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">{content.platform.title}</h2>
                <p className="max-w-2xl mx-auto mb-12 text-muted-foreground">
                    {content.platform.description}
                </p>
                <div className="flex flex-wrap justify-center items-center gap-6">
                    <Button asChild variant="outline" size="lg" className="gap-3 group bg-background/50 md:hover:bg-accent">
                        <Link href="#">
                            <div className="text-primary transition-transform md:group-hover:scale-110">
                                {platformIcons["Windows"]}
                            </div>
                            <span>Download for <span className="font-semibold">Windows</span></span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-3 group bg-background/50 md:hover:bg-accent">
                        <Link href="#">
                            <div className="text-primary transition-transform md:group-hover:scale-110">
                                {platformIcons["Linux"]}
                            </div>
                            <span>Download for <span className="font-semibold">Linux</span></span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-3 group bg-background/50 md:hover:bg-accent">
                        <Link href="#">
                            <div className="text-primary transition-transform md:group-hover:scale-110">
                                {platformIcons["Android"]}
                            </div>
                            <span>Download for <span className="font-semibold">Android</span></span>
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
        
        {/* Tech Stack Section */}
        <section className="py-16 px-4 bg-secondary/20">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">{content.techStack.title}</h2>
                <div className="flex flex-wrap justify-center items-center gap-10">
                    {content.techStack.items.map((tech, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center gap-4 transition-transform md:hover:-translate-y-2"
                        >
                            {techStackIcons[tech.name]}
                            <h3 className="text-lg font-bold">{tech.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="text-center py-20 px-4">
            <h2 className="text-3xl font-bold mb-4">{content.finalCta.title}</h2>
            <p className="max-w-xl mx-auto text-muted-foreground mb-8">
                {content.finalCta.subtitle}
            </p>
            <Button asChild size="lg" className="group">
                <Link href="/dashboard">
                    <>
                        {content.finalCta.button}{' '}
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                </Link>
            </Button>
        </section>
      </main>
      <footer className="bg-card text-card-foreground">
        <div className="w-full bg-secondary/30">
            <div className="container mx-auto py-10 px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold mb-4">{content.footer.get_to_know_us}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">{content.footer.about}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.careers}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.press_releases}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.science}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">{content.footer.connect}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">{content.footer.facebook}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.twitter}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.instagram}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">{content.footer.make_money}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">{content.footer.sell_on}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.sell_under}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.protect_brand}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.global_selling}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.affiliate}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.fulfilment}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.advertise}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">{content.footer.let_us_help}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">{content.footer.your_account}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.returns_centre}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.purchase_protection}</Link></li>
                            <li><Link href="#" className="hovertext-primary">{content.footer.app_download}</Link></li>
                            <li><Link href="#" className="hover:text-primary">{content.footer.help}</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div className="container mx-auto py-6 px-4 flex flex-wrap flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/20">
            <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold group"
              >
                <Logo className="h-10 w-auto transition-transform group-hover:scale-105" />
             </Link>
            <div className="flex flex-col sm:flex-row items-center gap-2">
            </div>
        </div>
        <div className="bg-secondary/30">
            <div className="container mx-auto py-4 px-4 text-center text-sm text-muted-foreground">
                <p>{content.footer.copyright}</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
