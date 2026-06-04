require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
(async function () {
    const url = process.env.SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
        console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
        process.exit(2);
    }
    const supabase = createClient(url, key);
    try {
        const { data, error } = await supabase
            .from('information_schema.columns')
            .select('column_name,data_type')
            .eq('table_name', 'tickets')
            .eq('table_schema', 'public');
        if (error) {
            console.error('Error querying information_schema.columns:', error);
            process.exit(1);
        }
        console.log('Columns for table tickets:');
        data.forEach(r => console.log('-', r.column_name, r.data_type));
        process.exit(0);
    } catch (err) {
        console.error('Unexpected error:', err);
        process.exit(1);
    }
})();