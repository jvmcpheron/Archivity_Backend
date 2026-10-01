import { supabase } from '../supabase/client.js';

export async function getActivities() {
	return supabase
		.from('Activity')
		.select('*');
}

export async function addActivity(activity) {
	return supabase
		.from('Activity')
		.insert(activity)
		.select()
		.single();
}
