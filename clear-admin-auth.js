// Script to clear admin authentication data
// Run this in your browser console when on the admin site

console.log('Clearing admin authentication data...');
localStorage.removeItem('adminToken');
localStorage.removeItem('adminUser');
localStorage.removeItem('admin-theme');
console.log('Admin authentication data cleared!');
console.log('Please refresh the page and try accessing /admin/dashboard again.');
