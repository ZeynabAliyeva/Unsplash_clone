import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import AdminFeatures from "../../features/AdminFeatures";


const client = new QueryClient();

function Admin() {
  return (
    <>
      <QueryClientProvider client={client}>
        <AdminFeatures />
      </QueryClientProvider>
    </>
  );
}

export default Admin;
