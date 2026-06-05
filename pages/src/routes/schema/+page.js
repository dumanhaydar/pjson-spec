// Source of truth: pjson.schema.json at the repo root, one level above this `pages/` project.
import schema from '../../../../pjson.schema.json';

// Renders a JSON Schema type as a short readable label.
function typeLabel(prop) {
	if (!prop) return '—';
	if (prop.$ref) return prop.$ref.replace('#/$defs/', '').replace(/^/, '→ ');
	if (prop.enum) return prop.enum.map((v) => (v === null ? 'null' : JSON.stringify(v))).join(' · ');
	if (prop.const !== undefined) return JSON.stringify(prop.const);
	if (prop.type === 'array') {
		const items = prop.items;
		let inner = 'any';
		if (items?.$ref) inner = items.$ref.replace('#/$defs/', '');
		else if (items?.enum) inner = 'enum';
		else if (items?.type) inner = items.type;
		return `${inner}[]`;
	}
	if (Array.isArray(prop.type)) return prop.type.join(' | ');
	if (prop.type) return prop.type;
	return 'object';
}

function buildObject(def, name) {
	const required = new Set(def.required || []);
	const props = Object.entries(def.properties || {}).map(([key, p]) => ({
		key,
		type: typeLabel(p),
		required: required.has(key),
		enum: p.enum ?? null,
		format: p.format ?? null,
		ref: p.$ref ? p.$ref.replace('#/$defs/', '') : p.items?.$ref?.replace('#/$defs/', '') ?? null,
		description: p.description ?? null
	}));
	return {
		name,
		additionalProperties: def.additionalProperties !== false,
		props
	};
}

export function load() {
	const root = buildObject(schema, 'pjson (root)');

	const defs = Object.entries(schema.$defs || {})
		.filter(([, d]) => d.type === 'object' && d.properties)
		.map(([name, d]) => buildObject(d, name));

	// Simple types (enums / aliases) listed separately.
	const simples = Object.entries(schema.$defs || {})
		.filter(([, d]) => !(d.type === 'object' && d.properties))
		.map(([name, d]) => ({
			name,
			label: typeLabel(d)
		}));

	return { root, defs, simples, version: schema.properties?.pjson_version?.pattern ?? '1.0' };
}
