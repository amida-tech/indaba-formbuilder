Formbuilder.registerField 'radio',

  order: 40

  view: """
    <ol style='list-style-type: <%= rf.get(Formbuilder.options.mappings.OPTION_NUMBERING) %>;'>
    <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>
      <li>
        <label class='fb-option'>
          <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick="javascript: return false;" />
          <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
        </label>
      </li>
    <% } %>    

    <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>
      <li class='other-option'>
        <label class='fb-option'>
          <input type='radio' />
          Other
        </label>

        <input type='text' />
      </li>
    <% } %>
    </ol>
  """

  edit: """
    <%= Formbuilder.templates['edit/options']({ includeOther: true }) %>
  """

  addButton: """
    <span class='symbol'><span class='fa fa-circle-o'></span></span> Multiple Choice
  """

  defaultAttributes: (attrs) ->
    # @todo
    attrs.field_options.options = [
      label: "",
      checked: false,
      value: ""
    ,
      label: "",
      checked: false,
      value: ""
    ]
    
    attrs.field_options.option_numbering = 'none'
    
    attrs