module.exports = {
    totalValue: `
      SELECT SUM((holding->>'units')::float * (holding->>'unitPrice')::float) as total_value
      FROM accounts, jsonb_array_elements(holdings) as holding
      WHERE holdings IS NOT NULL;
    `,
    topSecurities: `
      SELECT 
        s.ticker, 
        s.name, 
        SUM((holding->>'units')::float) as total_units
      FROM accounts, jsonb_array_elements(holdings) as holding
      JOIN securities s ON s.ticker = (holding->>'ticker')
      WHERE holdings IS NOT NULL
      GROUP BY s.ticker, s.name
      ORDER BY total_units DESC
      LIMIT 2;
    `,
    advisorsByCustodian: `
      SELECT 
        a.name as advisor_name,
        acc.custodian,
        SUM((holding->>'units')::float * (holding->>'unitPrice')::float) as total_assets
      FROM advisors a
      JOIN accounts acc ON acc.rep_id = ANY(
        SELECT jsonb_array_elements(custodians)->>'repId' FROM advisors WHERE id = a.id
      )
      CROSS JOIN jsonb_array_elements(acc.holdings) as holding
      WHERE acc.holdings IS NOT NULL
      GROUP BY a.name, acc.custodian
      ORDER BY acc.custodian, total_assets DESC;
    `
  };