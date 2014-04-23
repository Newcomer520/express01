(function(){
	function init()
	{
		$('#btnSend').on('click', sendMessage);
		$('#message').focus();
	}
	function sendMessage(e)
	{
		if ($.cookie('info') === undefined) {
			//data-toggle="modal"
			$('.bs-modal-sm').modal('toggle');
		}
		e.preventDefault();
	}
	$(document).ready(init);
})();
(function($){


})(jQuery);