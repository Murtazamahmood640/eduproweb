const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

const routes = [
    '/users/profile',
    '/users/student-stats',
    '/teacher/stats',
    '/teacher/courses',
    '/teacher/profile',
    '/registrations',
    '/courses',
    '/admin/stats',
    '/admin/courses',
    '/auth/send-otp'
];

async function checkRoutes() {
    console.log('--- Checking Backend Routes ---');
    for (const route of routes) {
        try {
            // We use HEAD or GET without auth, expecting 401/403 but NOT 404
            const url = baseURL + route;
            await axios.get(url);
            console.log(`✅ ${route}: Success (200)`);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    console.log(`❌ ${route}: 404 NOT FOUND`);
                } else {
                    console.log(`ℹ️ ${route}: ${error.response.status} ${error.response.statusText}`);
                }
            } else {
                console.log(`🔥 ${route}: ${error.message}`);
            }
        }
    }
}

checkRoutes();
