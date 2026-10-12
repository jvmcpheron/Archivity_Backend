import { supabase } from '../supabase/client.js';

const ACTIVITIES_CACHE_TTL_MS = 30_000;

let cachedActivities;
let cacheExpiresAt = 0;
let activitiesRequest;
let cacheVersion = 0;

function invalidateActivitiesCache() {
	cacheVersion += 1;
	cachedActivities = undefined;
	cacheExpiresAt = 0;
}

export async function getActivities() {
	if (cachedActivities !== undefined && Date.now() < cacheExpiresAt) {
		return { data: cachedActivities, error: null };
	}

	if (activitiesRequest) return activitiesRequest;

	const requestVersion = cacheVersion;
	activitiesRequest = supabase
		.from('Activity')
		.select('*')
		.then((result) => {
			if (!result.error && requestVersion === cacheVersion) {
				cachedActivities = result.data;
				cacheExpiresAt = Date.now() + ACTIVITIES_CACHE_TTL_MS;
			}
			return result;
		})
		.finally(() => {
			activitiesRequest = undefined;
		});

	return activitiesRequest;
}

export async function addActivity(activity) {
	const result = await supabase
		.from('Activity')
		.insert(activity)
		.select()
		.single();

	if (!result.error) invalidateActivitiesCache();
	return result;
}
