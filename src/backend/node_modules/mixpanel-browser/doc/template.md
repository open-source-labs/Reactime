---
category: 5ae0c2c9fa0ec6000345c0ac
title: JavaScript Full API Reference
---

<% for (const namespace of namespaces) { %>
# <%= namespace.name %>

<% for (const item of namespace.items) { %>
___
## <%= item.name %>
<%= item.description %>
<% if (item.usage)  { %>
### Usage:
<%= item.usage %><% } %>
<% if (item.notes)  { %>
### Notes:
<%= item.notes %><% } %><% if (item.arguments.length) { %>

| Argument | Type | Description |
| ------------- | ------------- | ----- |<% for (const arg of item.arguments) { %>
| **<%= arg.name %>** | <span class="mp-arg-type"><%= arg.types %></span></br></span><% if (arg.required) { %><span class="mp-arg-required">required</span><% } else { %><span class="mp-arg-optional">optional</span><% } %> | <%= arg.description %> |<% } %><% } %><% if (item.returns.length) { %>
#### Returns:
| Type | Description |
| ----- | ------------- |<% for (const ret of item.returns) { %>
| <span class="mp-arg-type"><%= ret.types %></span> | <%= ret.description %> |<% } %><% } %>

<% } %>
<% } %>
