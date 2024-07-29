migrate((db) => {
  const dao = new Dao(db);

  const admin = new Admin();
  admin.email = process.env.POCKETBASE_ADMIN_EMAIL;
  admin.setPassword(process.env.POCKETBASE_ADMIN_PASSWORD);

  dao.saveAdmin(admin);
});
