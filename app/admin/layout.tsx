import React from "react";
import AdminNav from "@/app/components/admin/AdminNav";

export const metadata = {
  title: 'Next-shop Admin',
  description: 'Next-shop Admin',
};

const AdminLayout = ({ children }: {children: React.ReactNode}) => {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
}

export default AdminLayout;