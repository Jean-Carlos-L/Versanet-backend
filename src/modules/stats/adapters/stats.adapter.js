export function statsAdapterDTO(data) {
  return {
    totalContracts: data.totalContracts,
    activeContracts: data.activeContracts,
    inactiveContracts: data.inactiveContracts,
    totalClients: data.totalClients,
    clientsWith30MPlan: data.clientsWith30MPlan,
    clientsWith60MPlan: data.clientsWith60MPlan,
    clientsWith90MPlan: data.clientsWith90MPlan,
  };
}
