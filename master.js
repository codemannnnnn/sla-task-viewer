const xmlBody = `<root RuleMarker="1">
  <Object Name="Entity" ObjectID="1" ObjectPK="1000009">
    <Association ActionTypeID="1" ObjectID="11">
      <Property Name="ObjectTypeID" ObjectID="37" ObjectPK="76" PriorValue="" ActionTypeID="2">109973</Property>
      <Object ObjectID="34" ActionTypeID="1" Selected="1">
        <Property Name="ObjectTypeID" ObjectID="37" ObjectPK="76" PriorValue="" ActionTypeID="2">12571</Property>
      </Object>
    </Association>
  </Object>
<UserToken EntityID="1017779" FirstName="Dashboard" MiddleName="" LastName="Interface" EntityName="Dashboard Interface" EntitySecurity="False" NTUserName="DashboardInterface" AdhocReporting="False" AdhocReportingKey="" SecureLoginCode="" QuestionsHistoryID="-1" SystemMFATypeID="0" UserMFATypeID="0" MFASecretOPVID="-1" MFATimeout="0" Expiration="2046-04-22T01:45:43.286"> <UserGroup EntityName="All Users Group">999989</UserGroup> <UserGroup EntityName="All Users Group">999989</UserGroup> <UserGroup EntityName="GLSuite Universal Administrator">999904</UserGroup> <UserGroup EntityName="GLSuite Universal Configuration">999901</UserGroup> <UserGroup EntityName="GLSuite Universal Correspondence and Reports">999905</UserGroup> <UserGroup EntityName="GLSuite Universal Security Administrator">999903</UserGroup> <UserGroup EntityName="GLSuite Universal Security Administrator">999903</UserGroup> <UserGroup EntityName="GLSuite Universal Correspondence and Reports">999905</UserGroup> <UserGroup EntityName="GLSuite Universal Administrator">999904</UserGroup> <UserGroup EntityName="GLSuite Universal Configuration">999901</UserGroup> <UserGroup EntityName="GLSuite Universal Correspondence and Reports">999905</UserGroup> <UserGroup EntityName="GLSuite Universal Security Administrator">999903</UserGroup> <UserGroup EntityName="GLSuite Universal Configuration">999901</UserGroup> <UserGroup EntityName="GLSuite Universal Read Write Access">999902</UserGroup> <UserGroup EntityName="gDFPS_S_TS_NetworkAdministration_ITServiceRequest_Contributors">-7</UserGroup> <UserGroup EntityName="gDFPS_S_TS_NetworkAdministration_SystemEvent_Contributors">-10</UserGroup> <UserGroup EntityName="gRole_SystemsAdministrator">-295</UserGroup> <UserGroup EntityName="gDFPS_B_Sales_ProspectSales_Procurement_Contributors">-109</UserGroup> <UserGroup EntityName="gRole_SystemSecurityAdministrator">-312</UserGroup><![CDATA[jOoTCCyUxPQlgOnzUQKWa0Y6chHHrp8+PDaLnzlOGvV4iZHeoddIErLqFkAWy5ucm4Frhy1erz0hy6ZRi/RPKg==]]></UserToken>
</root>`;

async function processDocument() {
  const url = "/api/proxy";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xmlBody,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    console.log("Response:", json);
    document.getElementById("response").textContent = JSON.stringify(json, null, 2);
    return json;

  } catch (error) {
    console.error("Request failed:", error);
    document.getElementById("response").textContent = `Request failed: ${error.message}`;
    throw error;
  }
}