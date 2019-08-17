var includePath = '../../../global/js/';

function includeJavaScript(jsFile)
{
  document.write('<script type="text/javascript" src="' + jsFile + '"></scr' + 'ipt>'); 
}

function includeCss(cssFile)
{
  document.write('<link rel="stylesheet" href="' + cssFile + '"/>'); 
}

includeJavaScript(includePath+'core/jquery-1.7.2.min.js');
includeJavaScript(includePath+'core/hammer_v1.js');
includeJavaScript(includePath+'core/jquery.hammer_v1.js');
includeJavaScript(includePath+'core/jquery.salesdriver_core_v1.js');
includeJavaScript(includePath+'core/jquery.salesdriver_gesture_v1.js');
includeJavaScript(includePath+'core/jquery.salesdriver_gesture_conf_v1.js');
includeJavaScript(includePath+'dependancies/svg/jquery.svg.js');
includeJavaScript(includePath+'dependancies/svg/jquery.svganim.js');
includeJavaScript(includePath+'dependancies/transform/jquery.transform.js');
includeJavaScript(includePath+'dependancies/transform/modernizr-2.6.2.min.js');
includeJavaScript(includePath+'creative/jquery.salesdriver_audio.js');
includeJavaScript(includePath+'creative/jquery.salesdriver_data.js');
includeJavaScript(includePath+'creative/jquery.salesdriver_log.js');
includeJavaScript(includePath+'creative/jquery.salesdriver_popup.js');
includeJavaScript(includePath+'creative/jquery.salesdriver_svg.js');
includeJavaScript(includePath+'creative/jquery.salesdriver_toggle.js');
includeJavaScript(includePath+'creative/jquery.salesdriver_tooltip.js');
includeJavaScript(includePath+'creative/jquery.salesdriver_transform.js');
includeJavaScript(includePath+'creative/jquery.salesdriver_tween.js');
includeJavaScript(includePath+'creative/jquery.salesdriver_video.js');
includeJavaScript(includePath+'creative/jquery.salesdriver_zoom.js');
includeJavaScript(includePath+'creative/jquery.salesdriver_fonts.js');
includeJavaScript('../../javascript/functions.js');
includeJavaScript('../../javascript/variables.js');
includeJavaScript('../../javascript/references.json');
includeCss('../../css/templates.css');
includeCss('../../css/styles.css');
