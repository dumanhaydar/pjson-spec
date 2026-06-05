// Centralized site configuration.
const REPO = 'https://github.com/dumanhaydar/pjson-spec';

export const site = {
	name: 'pjson',
	tagline: 'A structured IPTV playlist format',
	description:
		'A strict, typed, validatable JSON playlist that replaces every IPTV playlist format in use today — m3u, m3u_plus, and provider-specific dumps. Source-independent.',
	version: '1.0',
	repo: REPO,
	links: {
		repo: REPO,
		issues: `${REPO}/issues`,
		newIssue: `${REPO}/issues/new`,
		discussions: `${REPO}/discussions`,
		spec: `${REPO}/blob/main/SPEC.md`,
		schema: `${REPO}/blob/main/pjson.schema.json`,
		schemaRaw: `${REPO}/raw/main/pjson.schema.json`,
		// "Propose a change" to a section: edit directly on GitHub.
		editSpec: `${REPO}/edit/main/SPEC.md`,
		license: `${REPO}/blob/main/LICENSE`
	}
};
