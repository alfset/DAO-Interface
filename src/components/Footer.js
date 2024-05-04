import React from 'react';

const Footer = () => {
    return (
        <footer className="text-white p-4 mt-8">
            <div className="footer-container mx-auto max-w-7xl text-center">
                <p>© 2024 Oracle DAO Controlized. All rights reserved.</p>
                <div className="links mt-2">
                    <a href="/docs" className="mx-2">Documentation</a>
                    <a href="https://twitter.com/OracleDAO" className="mx-2">Twitter</a>
                    <a href="https://github.com/alfset/oracle" className="mx-2">GitHub</a>
                    <a href="https://discord.gg/OracleDAO" className="mx-2">Discord</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
