const fs = require('fs');
const file = 'C:/Users/Asus/Downloads/Nothern Province Sports Complex/frontend/src/app/pages/admin/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf-8');

// Fix 1: isEditDialogOpen -> editDialogOpen
// Fix 2: setIsEditDialogOpen -> setEditDialogOpen
content = content.split('isEditDialogOpen').join('editDialogOpen');
content = content.split('setIsEditDialogOpen').join('setEditDialogOpen');

fs.writeFileSync(file, content);
console.log('Fixed Dialog state variable names.');
