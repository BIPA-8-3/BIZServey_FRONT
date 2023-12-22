import * as React from "react";
import AdminDashboard from "../../components/admin/AdminDashboard";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminMainPage() {
  return (
    <div style={{display:'flex'}}>
      <AdminHeader />
      <AdminDashboard />
    </div>
  );
}
