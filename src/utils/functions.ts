import { redirect } from "react-router-dom";
import {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} from "../contacts";
import { Params as ParamsType } from "./types";

export async function rootLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q ?? "");
  return { contacts, q };
}

export async function contactLoader({ params }: { params: ParamsType }) {
  const contact = await getContact(params.contactId ?? "");

  if (!contact) {
    throw new Response("", { status: 404, statusText: "Not Found" });
  }
  return contact;
}

export async function rootAction() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export async function editAction({
  request,
  params,
}: {
  request: Request;
  params: ParamsType;
}) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId ?? "", updates);
  return redirect(`/contacts/${params.contactId}`);
}

export async function destroyAction({ params }: { params: ParamsType }) {
  await deleteContact(params.contactId ?? "");
  return redirect("/");
}

export async function contactAction({
  request,
  params,
}: {
  request: Request;
  params: ParamsType;
}) {
  let formData = await request.formData();
  return updateContact(params.contactId || "", {
    favorite: formData.get("favorite") as string,
  });
}
