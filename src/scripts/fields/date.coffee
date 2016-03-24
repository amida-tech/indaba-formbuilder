Formbuilder.registerField 'date',

  order: 70

  view: """
    <div class='fb-date'>
        <input type="text" />
        <span class="symbol"><span class="fa fa-calendar"></span></span>
    </div>
  """

  edit: ""

  addButton: """
    <span class="symbol"><span class="fa fa-calendar"></span></span> <%= Formbuilder.i18n('DATE') %>
  """
