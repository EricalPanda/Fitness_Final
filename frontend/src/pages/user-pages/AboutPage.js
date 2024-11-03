import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import About from '../../components/user-components/About';

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="About Us" readOnly />
            <About />
            <Footer />
        </>
    )
}