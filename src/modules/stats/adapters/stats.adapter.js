export function statsAdapterDTO(data) {
  return {
    totalContracts: data.totalContracts[0].total,
    activeContracts: data.activeContracts[0].active,
    inactiveContracts: data.inactiveContracts[0].inactiveContracts,
    totalClients: data.totalClients[0].totalClients,
    clientsWith30MPlan: data.clientsWith30MPlan[0][`clientsWith30MPlan`],
    clientsWith60MPlan: data.clientsWith60MPlan[0][`clientsWith60MPlan`],
    clientsWith90MPlan: data.clientsWith90MPlan[0][`clientsWith90MPlan`],
  };
}
