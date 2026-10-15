/* Sổ thi đua 12A3 – cầu nối giữa trang web (GitHub Pages) và Google Apps Script */
var SOTD_API = 'https://script.google.com/macros/s/AKfycbymasMaCIwiS37FZUG3LpHf8HhodfCD3dlPUanZzQMdhWSAS8dsEtN5zUkdOxRYJVnz/exec';
function sotdCall(fn, args) {
  return fetch(SOTD_API, {
    method: 'POST', body: JSON.stringify({ fn: fn, args: args || [] }),
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, credentials: 'omit', redirect: 'follow', cache: 'no-store'
  }).then(function (r) {
    if (!r.ok) throw new Error('Máy chủ chưa phản hồi (mã ' + r.status + '). Thử lại sau ít phút.');
    return r.json();
  }, function () { throw new Error('Không kết nối được. Kiểm tra mạng rồi thử lại.'); })
    .then(function (j) { if (!j || !j.ok) throw new Error((j && j.error) || 'Có lỗi xảy ra.'); return j.data; });
}
(function () {
  var NAMES = ['duLieuLopXem', 'layHocSinh', 'layDuLieu', 'ghiNhan', 'xoaGhiNhan', 'guiMaDangNhap', 'xacNhanMa', 'kiemTraQuyenToken', 'dangXuat'];
  function mk(ok, fail) {
    var r = { withSuccessHandler: function (f) { return mk(f, fail); }, withFailureHandler: function (f) { return mk(ok, f); } };
    NAMES.forEach(function (n) {
      r[n] = function () {
        sotdCall(n, [].slice.call(arguments)).then(function (d) { if (ok) ok(d); }, function (e) { if (fail) fail(e); });
      };
    });
    return r;
  }
  window.google = { script: { run: mk(null, null) } };
})();
function sotdB64(str) {
  var b = new TextEncoder().encode(str), s = '';
  for (var i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, b.subarray(i, i + 8192));
  return btoa(s);
}
function sotdParam(n) { try { return new URLSearchParams(location.search).get(n) || ''; } catch (e) { return ''; } }
function sotdStore(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
(function () {
  var css = '#sotdLoad{position:fixed;inset:0;z-index:999;display:grid;place-items:center;background:var(--bg,#f1f3f9);transition:opacity .3s ease}' +
    '#sotdLoad.hide{opacity:0;pointer-events:none}#sotdLoad div{text-align:center;font-family:"Be Vietnam Pro",system-ui,sans-serif;color:var(--muted,#6a7390);font-size:14px;font-weight:600;padding:24px}' +
    '#sotdLoad i{display:block;width:42px;height:42px;margin:0 auto 14px;border-radius:50%;border:4px solid rgba(35,80,230,.18);border-top-color:#2350e6;animation:sotdRot .8s linear infinite}' +
    '#sotdLoad b{display:block;color:var(--ink,#0f1830);font-size:17px;margin-bottom:6px}#sotdLoad a{color:#2350e6;font-weight:700}' +
    '@keyframes sotdRot{to{transform:rotate(360deg)}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();
function sotdLoading(text) {
  var d = document.getElementById('sotdLoad');
  if (!d) { d = document.createElement('div'); d.id = 'sotdLoad'; document.body.appendChild(d); }
  d.className = ''; d.innerHTML = '<div><i></i>' + (text || 'Đang tải dữ liệu…') + '</div>';
}
function sotdDone() { var d = document.getElementById('sotdLoad'); if (d) { d.className = 'hide'; setTimeout(function () { d.remove(); }, 400); } }
function sotdError(title, msg) {
  sotdLoading();
  var d = document.getElementById('sotdLoad'), t = document.createElement('div');
  t.innerHTML = '<b></b><span></span><p><a href="javascript:location.reload()">Thử lại</a></p>';
  t.querySelector('b').textContent = title; t.querySelector('span').textContent = msg;
  d.innerHTML = ''; d.appendChild(t);
}
