const sponsorTime = 5;

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('window-reset').addEventListener('click', event => {
		window.electronAPI.window('reset');
	})

	document.getElementById('window-exit').addEventListener('click', event => {
		if (confirm('Close all Viking windows?')) window.electronAPI.window('exit');
	})

	document.getElementById('link-stop').addEventListener('click', event => {
		window.electronAPI.clear();
		clearActive();
	})

	document.getElementById('popout').addEventListener('click', event => {
		window.electronAPI.window('popout');
	})

	document.getElementById('hide').addEventListener('click', event => {
		window.electronAPI.window('hide');
	})

	document.getElementById('import').addEventListener('click', event => {
		const files = document.getElementById('formFile').files;
		const reader = new FileReader();
		reader.onload = event => {
			const rows = event.target.result.split('\n');
			if (rows.length == 0) return;
			for (let index = 1; index < 8; index++) {
				const _link = document.getElementById(`link${index}`);
				const _lable = document.getElementById(`link${index}-lable`);
				if (rows[0] == "") rows.shift();
				const lable = rows.shift();
				if (lable.includes('http')) {
					_link.value = lable;
				} else {
					const link = rows.shift();
					if (link.includes('http')) {
						_link.value = link;
						_lable.value = lable;
					} else {
						alert('File invalid, must have Label then Link, or just links');
						return;
					}
				}
				if (rows.length == 0) return;
			}
		};
		reader.readAsText(files[0]);
	})

	document.getElementById('export').addEventListener('click', event => {
		let txt = "";
		for (let index = 1; index < 8; index++) {
			const lable = document.getElementById(`link${index}-lable`).value;
			const link = document.getElementById(`link${index}`).value;
			if (lable !== "") txt += lable + '\n';
			if (link !== "") txt += link + '\n';
		}
		download(`Links.txt`,txt);
	})

	for (let index = 1; index < 8; index++) {
		document.getElementById(`link${index}-but`).addEventListener('click', event => {
			setLink(index);
		})
	}

	window.electronAPI.setLink((event, message) => {
		loadLink(message);
	});

	window.electronAPI.doClear(() => {
		document.getElementById('currency').setAttribute('src', '');
		document.getElementById('info').setAttribute('src', '');
		clearActive();
	});

	window.electronAPI.doSponsor(() => {
		document.getElementById('cont').classList.add('sponsor');
		setTimeout(()=>{
			document.getElementById('cont').classList.remove('sponsor');
		}, 6*1000)
	});

	if (popout) {
		const timer = document.getElementById('sponsorTime');
		let time = sponsorTime * 60 * 1000;
		setInterval(() => {
			const seconds = Number((time/1000)%60).toFixed(0);
			timer.innerHTML = `${Math.floor(time/60000).toFixed(0)}:${String(seconds).padStart(2, '0')}`;
			time -= 1000;
			if (time < 1) {
				window.electronAPI.sponsor();
				time = sponsorTime * 60 * 1000;
			}
		}, 1000);
		//setInterval(() => {
		//	window.electronAPI.sponsor();
		//}, sponsorTime * 60 * 1000)

		document.getElementById('sponsorNow').addEventListener('click', event => {
			time = 2000;
		})
	};
})

function setLink(index) {
	const rawLink = document.getElementById(`link${index}`).value;
	if (!rawLink.includes('http')) {
		alert('Invalid link');
		return;
	}
	clearActive();
	const _link = document.getElementById('link'+index);
	_link.classList.add('linkActive');
	const link = rawLink.replace('/currency', '');
	window.electronAPI.link(link);
}

function loadLink(link) {
	document.getElementById('currency').setAttribute('src', link+"/currency");
	document.getElementById('info').setAttribute('src', link);
}

function clearActive() {
	const activeLinks = document.getElementsByClassName('linkActive');
	for (const _link of activeLinks) {
		_link.classList.remove('linkActive');
	}
}

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}