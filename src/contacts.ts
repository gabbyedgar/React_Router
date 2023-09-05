import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import { Contact, Update } from "./utils/types";

// `query` is optional.
export async function getContacts(query?: string) {
  await fakeNetwork(`getContacts:${query}`);
  // Contact[] | null
  let contacts: Contact[] | null = await localforage.getItem("contacts");
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
  await fakeNetwork();
  // `const` instead of `let`.
  const id = Math.random().toString(36).substring(2, 9);
  const contact = { id, createdAt: Date.now() };
  const contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

// `id` is of `string` type.
export async function getContact(id: string) {
  await fakeNetwork(`contact:${id}`);
  const contacts = (await localforage.getItem("contacts")) as Contact[];
  const contact = contacts.find((contact) => contact.id === id);
  return contact ?? null;
}

export async function updateContact(id: string, updates: Update) {
  await fakeNetwork();
  const contacts: Contact[] | null = await localforage.getItem("contacts");

  // Add TypeGuard
  if (!Array.isArray(contacts) || contacts.length === 0)
    throw new Error("No contact found for " + id);

  const contact = contacts.find((contact) => contact.id === id);
  if (!contact) throw new Error("No contact found for " + id);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id: string) {
  const contacts: Contact[] | null = await localforage.getItem("contacts");

  // Add TypeGuard
  if (!Array.isArray(contacts) || contacts.length === 0)
    throw new Error("No contact found for " + id);

  const index = contacts.findIndex((contact) => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts: Contact[]) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
// An object's key is likely of a `string` type or a `number` type.
// The value of `fakeCache`'s key is a boolean from line 94.
let fakeCache: { [key in string | number]?: boolean } = {};

// `key` is an optional parameter.
async function fakeNetwork(key?: string | number) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key as unknown as string]) {
    return;
  }

  fakeCache[key as unknown as string] = true;
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}
