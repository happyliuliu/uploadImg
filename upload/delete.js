$(document).ready(function() {
	$("button.deleteBtn").click(function(e) {
		// console.log($(this));
		// alert($(this).attr('id'));
		var id = $(this).attr('id');
		var self = $(this);
		if (confirm('你确认要删除吗？')) {
			$.ajax({
				method: 'post',
				url: '/show',
				data: {
					id: id 
				},
				success: function(res) {
					if(res.code == 200) {
						self.parent().css('display', 'none');
						// alert(res.msg);
					}
				},
				error: function() {

				}
			});
		} else {
			return;
		}
	});
});