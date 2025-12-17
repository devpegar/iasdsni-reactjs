function hasPermission(userRole, allowed = []) {
  return allowed.includes(userRole);
}
export default hasPermission;
