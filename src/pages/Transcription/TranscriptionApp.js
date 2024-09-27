import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TranscriptionApp = () => {
  const content = `### Servicenow Response\\n\\nManaging user access and permissions in ServiceNow involves several key steps and concepts. Here's a comprehensive overview:  1. **User Creation**\\n- **Manual Creation**: Administrators can manually create user records in the User table (\\`sys_user\\`).\\n- **Automated Creation**: Users can be imported from external systems such as LDAP, SSO, or other identity management systems.  2. **Roles**\\n- Roles are sets of permissions that can be assigned to users.\\n- Common roles include \\`admin\\`, \\`itil\\`, \\`approver_user\\`, and \\`employee\\`.\\n- Custom roles can also be created to meet specific organizational needs.  3. **Groups**\\n- Groups are collections of users that can be managed together.\\n- Groups can be assigned roles, making it easier to manage permissions for multiple users.  4. **Assigning Roles to Users and Groups**\\n- Roles can be assigned directly to individual users.\\n- Roles can also be assigned to groups, and all users in that group will inherit the roles.  5. **Access Control Rules (ACLs)**\\n- ACLs control access to tables and records.\\n- They can be defined at the table, field, and script levels.\\n- ACLs use conditions, scripts, and roles to determine whether access should be granted.  6. **Business Rules and UI Policies**\\n- Business rules can enforce security and permissions by scripting.\\n- UI policies can dynamically change the behavior of forms and fields based on user roles or other conditions.  7. **Data Security**\\n- **Table-Level Security**: Controls access to entire tables.\\n- **Field-Level Security**: Controls access to specific fields within tables.\\n- **Row-Level Security**: Controls access to specific records within tables.  8. **Domain Separation**\\n- For multi-tenant environments, domain separation can be used to partition data and processes.  Steps to Manage User Access and Permissions: # 1. **Create or Import Users**\\n   - Navigate to \\`User Administration > Users\\` to create new users or import them. # 2. **Create or Import Groups**\\n   - Navigate to \\`User Administration > Groups\\` to create new groups or import them. # 3. **Assign Roles to Users/Groups**\\n   - Navigate to \\`User Administration > Users\\` or \\`User Administration > Groups\\`.\\n   - Edit the user or group record and add the necessary roles in the \\`Roles\\` related list. # 4. **Define Access Control Rules (ACLs)**\\n   - Navigate to \\`System Security > Access Control (ACL)\\` to create or modify ACLs.\\n   - Define the conditions, roles, and scripts to enforce access control. # 5. **Use Business Rules and UI Policies for Dynamic Control**\\n   - Navigate to \\`System Definition > Business Rules\\` to create or modify business rules.\\n   - Navigate to \\`System UI > UI Policies\\` to create or modify UI policies. # 6. **Implement Domain Separation (if needed)**\\n   - Navigate to \\`Domain Administration > Domains\\` to set up and manage domains. By following these steps and leveraging these features, you can effectively manage user access and permissions in ServiceNow.`;

  // Replace escaped newline characters with literal newline characters
  const formattedContent = content.replace(/\\n/g, '\n');

  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{formattedContent}</ReactMarkdown>
    </div>
  );
};

export default TranscriptionApp;
