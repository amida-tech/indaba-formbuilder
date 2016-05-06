Formbuilder.registerField 'policy',

  order: 102

  type: 'wysiwyg'

  view: """
    <label class="fb-wysiwyg-label"><span><%= rf.get(Formbuilder.options.mappings.LABEL) %></span></label>
    <textarea class="fb-editor" data-placeholder="<%= Formbuilder.i18n('POLICY_PLACEHOLDER') %>"><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></textarea>
  """

  edit: """
    <%= Formbuilder.templates['edit/label']() %>
  """

  addButton: """
    <span class='symbol'><span class='fa fa-pencil-square-o'></span></span> <%= Formbuilder.i18n('WYSIWYG') %>
  """

