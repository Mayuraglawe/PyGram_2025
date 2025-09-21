import { useAuth } from '@/contexts/AuthContext';

export default function AdminTest() {
  const { user, hasPermission, isAuthenticated } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Test Page</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Authentication Status</h2>
          <p>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {user ? JSON.stringify(user, null, 2) : 'Not logged in'}</p>
        </div>
        
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-semibold">Permissions</h2>
          <p>Has manage_system: {hasPermission('manage_system') ? 'Yes' : 'No'}</p>
          <p>Has view_users: {hasPermission('view_users') ? 'Yes' : 'No'}</p>
          <p>Has create_departments: {hasPermission('create_departments') ? 'Yes' : 'No'}</p>
        </div>
        
        <div className="bg-green-100 p-4 rounded">
          <h2 className="font-semibold">Quick Actions</h2>
          <a href="/signin" className="text-blue-600 underline">Go to Sign In</a> | 
          <a href="/admin" className="text-blue-600 underline ml-2">Go to Admin Panel</a>
        </div>
      </div>
    </div>
  );
}