const pool = require('./db');
const queries = require('./queries');

async function processData() {
  try {
    /* 1. What is the total value across all of the accounts that the advisors
    are managing?*/
    const totalValueResponse = await pool.query(queries.totalValue);
    const totalValue = totalValueResponse.rows[0]?.total_value?.toFixed(2) || '0.00';
    console.log(`Total value across all accounts: $${totalValue}`);
    
    /*Identify the top securities held to get an idea of our risk exposure in
the markets.*/
    const topSecuritiesResponse = await pool.query(queries.topSecurities);
    console.log('Top securities held:');
    topSecuritiesResponse.rows.forEach(row => {
      console.log(`${row.ticker} (${row.name}): ${row.total_units} units`);
    });

    /*For each custodian provide an ordered list of which advisors has the
most assets at the custodian.*/
    const advisorsByCustodianResponse = await pool.query(queries.advisorsByCustodian);
    console.log('Advisors by custodian (ordered by assets):');
    let currentCustodian = '';
    advisorsByCustodianResponse.rows.forEach(row => {
      if (currentCustodian !== row.custodian) {
        console.log(`Custodian: ${row.custodian}`);
        currentCustodian = row.custodian;
      }
      console.log(`  ${row.advisor_name}: $${row.total_assets.toFixed(2)}`);
    });

    return {
      totalValue,
      topSecurities: topSecuritiesResponse.rows,
      advisorsByCustodian: advisorsByCustodianResponse.rows
    };
  } catch (err) {
    throw new Error(`Error processing data: ${err.message}`);
  }
}

if (require.main === module) {
  processData()
    .then(result => console.log('Processed data:', result))
    .catch(err => console.error(err.message));
}

module.exports = processData;