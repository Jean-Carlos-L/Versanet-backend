const defaultPermissions = [
  {
    id: "76b0ed7f-a517-11ef-8ec2-0242ac110002",
    descripcion: "Clientes",
    codigo: "9f2a7d1e4b6c3a8",
  },
  {
    id: "76b0f015-a517-11ef-8ec2-0242ac110002",
    descripcion: "Contratos",
    codigo: "3b8e1a6c9f2d4a7",
  },
  {
    id: "76b0f07e-a517-11ef-8ec2-0242ac110002",
    descripcion: "Planes",
    codigo: "a2d4f1c9e6b8a3f",
  },
  {
    id: "76b0f0a2-a517-11ef-8ec2-0242ac110002",
    descripcion: "Facturacion",
    codigo: "7c3e9a2b4f6d8a1",
  },
  {
    id: "76b0f0c4-a517-11ef-8ec2-0242ac110002",
    descripcion: "Inventario",
    codigo: "1e6b4a2d9f8c3a7",
  },
  {
    id: "76b0f0e5-a517-11ef-8ec2-0242ac110002",
    descripcion: "Historial",
    codigo: "b4f6c9e2d3a7a1f",
  },
  {
    id: "76b0f101-a517-11ef-8ec2-0242ac110002",
    descripcion: "Configuracion",
    codigo: "6c9f2a8d1b3e4a7",
  },
  {
    id: "ae7f8a01-a518-11ef-8ec2-0242ac110002",
    descripcion: "Panel de control",
    codigo: "d1a7c3e4b9f6a2d",
  },
];

const defaultRole = [
  {
    id: "76b0d9f2-a517-11ef-8ec2-0242ac110002",
    descripcion: "Administrador",
  },
];

const defaultRolePermissions = [
  {
    rol_id: "76b0d9f2-a517-11ef-8ec2-0242ac110002",
    permiso_id: "76b0f101-a517-11ef-8ec2-0242ac110002",
  },
  {
    rol_id: "76b0d9f2-a517-11ef-8ec2-0242ac110002",
    permiso_id: "76b0ed7f-a517-11ef-8ec2-0242ac110002",
  },
  {
    rol_id: "76b0d9f2-a517-11ef-8ec2-0242ac110002",
    permiso_id: "76b0f015-a517-11ef-8ec2-0242ac110002",
  },
  {
    rol_id: "76b0d9f2-a517-11ef-8ec2-0242ac110002",
    permiso_id: "76b0f07e-a517-11ef-8ec2-0242ac110002",
  },
  {
    rol_id: "76b0d9f2-a517-11ef-8ec2-0242ac110002",
    permiso_id: "76b0f0a2-a517-11ef-8ec2-0242ac110002",
  },
  {
    rol_id: "76b0d9f2-a517-11ef-8ec2-0242ac110002",
    permiso_id: "76b0f0c4-a517-11ef-8ec2-0242ac110002",
  },
  {
    rol_id: "76b0d9f2-a517-11ef-8ec2-0242ac110002",
    permiso_id: "76b0f0e5-a517-11ef-8ec2-0242ac110002",
  },
  {
    rol_id: "76b0d9f2-a517-11ef-8ec2-0242ac110002",
    permiso_id: "ae7f8a01-a518-11ef-8ec2-0242ac110002",
  },
];

const defaultUser = [
  {
    nombres: "Admin",
    correo_electronico: "admin@versanet.com",
    contrasena: "$2b$10$ysowtrIbAX0TJdKaDOgLw.Sd856HaBs4J1mw5HdcJTex917PnG0nG",
    rol_id: "76b0d9f2-a517-11ef-8ec2-0242ac110002",
  },
];

export async function initializeDefaultPermissions(permissionModel) {
  try {
    // Check for existing permissions by codigo to avoid duplicates
    const existingPermissions = await permissionModel.findAll({
      where: {
        codigo: defaultPermissions.map((p) => p.codigo),
      },
      attributes: ["codigo"],
    });

    const existingCodigos = existingPermissions.map((p) => p.codigo);
    const permissionsToInsert = defaultPermissions.filter(
      (p) => !existingCodigos.includes(p.codigo)
    );

    if (permissionsToInsert.length > 0) {
      await permissionModel.bulkCreate(permissionsToInsert, {
        individualHooks: true, // Trigger afterCreate hooks for each record
      });
      console.log("🟢 Default permissions inserted successfully.");
    } else {
      console.log("🟡 All default permissions already exist.");
    }
  } catch (error) {
    console.error("🔴 Error inserting default permissions:", error.message);
    throw error;
  }
}

export async function initializeDefaultRoles(roleModel) {
  try {
    const existingRole = await roleModel.findOne({
      where: { descripcion: "Administrador" },
    });
    
    if (!existingRole) {
      await roleModel.bulkCreate(defaultRole);
      console.log("🟢 Default roles inserted successfully.");
    } else {
      console.log("🟡 Default roles already exist.");
    }
  } catch (error) {
    console.error("🔴 Error inserting default roles:", error.message);
    throw error;
  }
}

export async function initializeDefaultRolePermissions(rolePermissionModel) {
  try {
    const count = await rolePermissionModel.count();
    if (count === 0) {
      await rolePermissionModel.bulkCreate(defaultRolePermissions);
      console.log("🟢 Default role-permissions inserted successfully.");
    } else {
      console.log("🟡 Default role-permissions already exist.");
    }
  } catch (error) {
    console.error(
      "🔴 Error inserting default role-permissions:",
      error.message
    );
    throw error;
  }
}

export async function initializeDefaultUsers(userModel) {
  try {
    const existingUser = await userModel.findOne({
      where: { correo_electronico: "admin@versanet.com" },
    });

    if (!existingUser) {
      await userModel.bulkCreate(defaultUser);
      console.log("🟢 Default users inserted successfully.");
    } else {
      console.log("🟡 Default users already exist.");
    }
  } catch (error) {
    console.error("🔴 Error inserting default users:", error.message);
    throw error;
  }
}
