// netlify/functions/api.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }

  try {
    const path = event.path.replace(/^\/\.netlify\/functions\/api/, '');
    const segments = path.split('/').filter(Boolean);
    const resource = segments[0];
    const method = event.httpMethod;
    const params = event.queryStringParameters || {};
    const body = event.body ? JSON.parse(event.body) : {};

    // Route API requests
    switch (resource) {
      case 'auth':
        return await handleAuth(method, segments[1], body, headers);
      case 'guests':
        return await handleGuests(method, segments[1], body, params, headers);
      case 'rsvp':
        return await handleRsvp(method, segments[1], body, params, headers);
      case 'menu':
        return await handleMenu(method, segments[1], body, params, headers);
      case 'tables':
        return await handleTables(method, segments[1], body, params, headers);
      case 'weddings':
        return await handleWeddings(method, segments[1], body, params, headers);
      case 'statistics':
        return await handleStatistics(method, segments[1], params, headers);
      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Resource not found' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Auth handlers
async function handleAuth(method, action, body, headers) {
  switch (action) {
    case 'signup':
      if (method !== 'POST') return methodNotAllowed(headers);
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: body.email,
        password: body.password
      });
      if (signupError) return errorResponse(signupError, headers);
      return successResponse(signupData, headers);

    case 'signin':
      if (method !== 'POST') return methodNotAllowed(headers);
      const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
        email: body.email,
        password: body.password
      });
      if (signinError) return errorResponse(signinError, headers);
      return successResponse(signinData, headers);

    case 'signout':
      if (method !== 'POST') return methodNotAllowed(headers);
      const { error: signoutError } = await supabase.auth.signOut();
      if (signoutError) return errorResponse(signoutError, headers);
      return successResponse({ message: 'Signed out successfully' }, headers);

    case 'user':
      if (method !== 'GET') return methodNotAllowed(headers);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) return errorResponse(userError, headers);
      return successResponse(userData, headers);

    case 'reset-password':
      if (method !== 'POST') return methodNotAllowed(headers);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(body.email);
      if (resetError) return errorResponse(resetError, headers);
      return successResponse({ message: 'Password reset email sent' }, headers);

    default:
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Auth action not found' })
      };
  }
}

// Guest handlers
async function handleGuests(method, id, body, params, headers) {
  const weddingId = params.weddingId;

  switch (method) {
    case 'GET':
      if (id) {
        const { data, error } = await supabase
          .from('guests')
          .select('*')
          .eq('id', id)
          .single();
        if (error) return errorResponse(error, headers);
        return successResponse(data, headers);
      } else if (weddingId) {
        const { data, error } = await supabase
          .from('guests')
          .select('*')
          .eq('wedding_id', weddingId);
        if (error) return errorResponse(error, headers);
        return successResponse(data, headers);
      }
      return errorResponse({ message: 'Missing id or weddingId parameter' }, headers);

    case 'POST':
      const { data: createData, error: createError } = await supabase
        .from('guests')
        .insert([body])
        .select();
      if (createError) return errorResponse(createError, headers);
      return successResponse(createData, headers);

    case 'PUT':
      if (!id) return errorResponse({ message: 'Missing id parameter' }, headers);
      const { data: updateData, error: updateError } = await supabase
        .from('guests')
        .update(body)
        .eq('id', id)
        .select();
      if (updateError) return errorResponse(updateError, headers);
      return successResponse(updateData, headers);

    case 'DELETE':
      if (!id) return errorResponse({ message: 'Missing id parameter' }, headers);
      const { error: deleteError } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);
      if (deleteError) return errorResponse(deleteError, headers);
      return successResponse({ message: 'Guest deleted successfully' }, headers);

    default:
      return methodNotAllowed(headers);
  }
}

// RSVP handlers
async function handleRsvp(method, action, body, params, headers) {
  switch (action) {
    case 'code':
      if (method !== 'GET') return methodNotAllowed(headers);
      const code = params.code;
      if (!code) return errorResponse({ message: 'Missing code parameter' }, headers);
      const { data: codeData, error: codeError } = await supabase
        .from('rsvp_codes')
        .select('*, guests(*)')
        .eq('code', code)
        .single();
      if (codeError) return errorResponse(codeError, headers);
      return successResponse(codeData, headers);

    case 'submit':
      if (method !== 'POST') return methodNotAllowed(headers);
      const { data: submitData, error: submitError } = await supabase
        .from('rsvp_responses')
        .insert([body])
        .select();
      if (submitError) return errorResponse(submitError, headers);
      return successResponse(submitData, headers);

    case 'responses':
      if (method !== 'GET') return methodNotAllowed(headers);
      const weddingId = params.weddingId;
      if (!weddingId) return errorResponse({ message: 'Missing weddingId parameter' }, headers);
      const { data: responsesData, error: responsesError } = await supabase
        .from('rsvp_responses')
        .select('*, guests(*)')
        .eq('wedding_id', weddingId);
      if (responsesError) return errorResponse(responsesError, headers);
      return successResponse(responsesData, headers);

    default:
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'RSVP action not found' })
      };
  }
}

// Menu handlers
async function handleMenu(method, action, body, params, headers) {
  const weddingId = params.weddingId;

  switch (action) {
    case 'options':
      if (method !== 'GET') return methodNotAllowed(headers);
      if (!weddingId) return errorResponse({ message: 'Missing weddingId parameter' }, headers);
      const { data: optionsData, error: optionsError } = await supabase
        .from('menu_options')
        .select('*')
        .eq('wedding_id', weddingId);
      if (optionsError) return errorResponse(optionsError, headers);
      return successResponse(optionsData, headers);

    case 'preferences':
      if (method === 'GET') {
        if (!weddingId) return errorResponse({ message: 'Missing weddingId parameter' }, headers);
        const { data: preferencesData, error: preferencesError } = await supabase
          .from('food_preferences')
          .select('*, guests(*)')
          .eq('wedding_id', weddingId);
        if (preferencesError) return errorResponse(preferencesError, headers);
        return successResponse(preferencesData, headers);
      } else if (method === 'POST') {
        const { data: submitData, error: submitError } = await supabase
          .from('food_preferences')
          .insert([body])
          .select();
        if (submitError) return errorResponse(submitError, headers);
        return successResponse(submitData, headers);
      }
      return methodNotAllowed(headers);

    default:
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Menu action not found' })
      };
  }
}

// Table handlers
async function handleTables(method, action, body, params, headers) {
  const weddingId = params.weddingId;

  switch (action) {
    case 'all':
      if (method !== 'GET') return methodNotAllowed(headers);
      if (!weddingId) return errorResponse({ message: 'Missing weddingId parameter' }, headers);
      const { data: tablesData, error: tablesError } = await supabase
        .from('tables')
        .select('*')
        .eq('wedding_id', weddingId);
      if (tablesError) return errorResponse(tablesError, headers);
      return successResponse(tablesData, headers);

    case 'assignments':
      if (method === 'GET') {
        if (!weddingId) return errorResponse({ message: 'Missing weddingId parameter' }, headers);
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('table_assignments')
          .select('*, guests(*), tables(*)')
          .eq('wedding_id', weddingId);
        if (assignmentsError) return errorResponse(assignmentsError, headers);
        return successResponse(assignmentsData, headers);
      } else if (method === 'POST') {
        const { data: assignData, error: assignError } = await supabase
          .from('table_assignments')
          .insert([body])
          .select();
        if (assignError) return errorResponse(assignError, headers);
        return successResponse(assignData, headers);
      }
      return methodNotAllowed(headers);

    default:
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Table action not found' })
      };
  }
}

// Wedding handlers
async function handleWeddings(method, action, body, params, headers) {
  const weddingId = params.weddingId || body.id;

  switch (action) {
    case 'details':
      if (method === 'GET') {
        if (!weddingId) return errorResponse({ message: 'Missing weddingId parameter' }, headers);
        const { data, error } = await supabase
          .from('weddings')
          .select('*')
          .eq('id', weddingId)
          .single();
        if (error) return errorResponse(error, headers);
        return successResponse(data, headers);
      } else if (method === 'PUT') {
        if (!weddingId) return errorResponse({ message: 'Missing weddingId parameter' }, headers);
        const { data, error } = await supabase
          .from('weddings')
          .update(body)
          .eq('id', weddingId)
          .select();
        if (error) return errorResponse(error, headers);
        return successResponse(data, headers);
      }
      return methodNotAllowed(headers);

    default:
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Wedding action not found' })
      };
  }
}

// Statistics handlers
async function handleStatistics(method, action, params, headers) {
  const weddingId = params.weddingId;

  switch (action) {
    case 'rsvp':
      if (method !== 'GET') return methodNotAllowed(headers);
      if (!weddingId) return errorResponse({ message: 'Missing weddingId parameter' }, headers);
      const { data: rsvpData, error: rsvpError } = await supabase
        .rpc('get_rsvp_statistics', { wedding_id: weddingId });
      if (rsvpError) return errorResponse(rsvpError, headers);
      return successResponse(rsvpData, headers);

    case 'menu':
      if (method !== 'GET') return methodNotAllowed(headers);
      if (!weddingId) return errorResponse({ message: 'Missing weddingId parameter' }, headers);
      const { data: menuData, error: menuError } = await supabase
        .rpc('get_menu_statistics', { wedding_id: weddingId });
      if (menuError) return errorResponse(menuError, headers);
      return successResponse(menuData, headers);

    default:
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Statistics action not found' })
      };
  }
}

// Helper functions
function successResponse(data, headers) {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(data)
  };
}

function errorResponse(error, headers) {
  return {
    statusCode: 400,
    headers,
    body: JSON.stringify({ error: error.message || error })
  };
}

function methodNotAllowed(headers) {
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}
