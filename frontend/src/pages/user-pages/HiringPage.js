import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import Hiring from '../../components/user-components/Hiring';

export default function HiringPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Hiring" readOnly />
            <Hiring />
            <Footer />
        </>
    )
}