Formbuilder.registerField 'scale',

  order: 90

  view: """
    <i class='fa fa-chevron-left'></i><input type='text' /><i class='fa fa-chevron-right'></i>
    <% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>
      <%= units %>
    <% } %>
  """

  edit: """
    <%= Formbuilder.templates['edit/min_max']() %>
    <%= Formbuilder.templates['edit/units']() %>
    <%= Formbuilder.templates['edit/integer_only']() %>
  """

  addButton: """
    <span class='symbol'><span class='fa fa-exchange'></span></span> Scale
  """
