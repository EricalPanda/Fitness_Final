import React from 'react';
import Navbar from '../../components/admin_components/NavbarAdmin';
import CreateUserAdmin from '../../components/admin_components/CreateUserAdmin';

const CreateUserAdminPage = () => {
    return (
        <>
            <Navbar />
            <div>
                <CreateUserAdmin />
            </div>
        </>
    );
};

export default CreateUserAdminPage;
