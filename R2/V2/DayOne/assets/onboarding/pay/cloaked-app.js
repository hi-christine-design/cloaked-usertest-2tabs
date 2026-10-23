/* Cloaked Pay — shared engine, screens and motion. */
/* ============================================================
   MOTION TOKENS — every transition is named and tunable
   ============================================================ */
const EASINGS = {
  'iOS default':'cubic-bezier(.32,.72,0,1)',
  'ease-out':'cubic-bezier(.2,0,0,1)',
  'ease-in-out':'cubic-bezier(.65,0,.35,1)',
  'material':'cubic-bezier(.4,0,.2,1)',
  'expo out':'cubic-bezier(.22,1,.36,1)',
  'gentle overshoot':'cubic-bezier(.34,1.4,.64,1)',
  'springy':'cubic-bezier(.34,1.56,.64,1)',
  'linear':'linear'
};
const MOTION = {
  push:     {label:'Screen push',   dur:420,  max:1200, ease:'iOS default',      note:'default screen-to-screen'},
  welcome:  {label:'Gold wash',     dur:1400, max:4000, ease:'material',         note:'6220:50882 → 50891 → 50899'},
  flood:    {label:'Brand flood',   dur:900,  max:2500, ease:'expo out',         note:'6221:52835 → 52864'},
  cardrise: {label:'Card rise',     dur:760,  max:2000, ease:'gentle overshoot', note:'reveal + fan-in'},
  select:   {label:'Tile select',   dur:200,  max:800,  ease:'ease-out',         note:'purpose / use-case tap'},
  merchant: {label:'Merchant row',  dur:360,  max:1200, ease:'iOS default',      note:'6221:52304 detect'},
  progress: {label:'Progress fill', dur:520,  max:1600, ease:'ease-in-out',      note:'header segment'},
  disc:     {label:'Verified pop',  dur:640,  max:1800, ease:'springy',          note:'6170:27563'},
  fade:     {label:'Cross-fade',    dur:520,  max:2000, ease:'material',         note:'welcome → identity'},
  washdelay:{label:'Read on gold',  dur:1800, max:5000, ease:'linear',           note:'dwell before the wash starts'},
  titlein:  {label:'Title chars',   dur:600,  max:2000, ease:'material',         note:'per-character blur-in'},
  subdelay: {label:'Subtitle wait', dur:550,  max:2000, ease:'material',         note:'delay before subtitle'},
  stagger:  {label:'Char stagger',  dur:20,   max:120,  ease:'linear',           note:'delay per character'}
};
const DEFAULTS = JSON.parse(JSON.stringify(MOTION));
let slowmo = 1;

function applyMotion(){
  const r = document.documentElement.style;
  for(const k in MOTION){
    r.setProperty('--dur-'+k, Math.round(MOTION[k].dur*slowmo)+'ms');
    r.setProperty('--ease-'+k, EASINGS[MOTION[k].ease]);
  }
}

/* ============================================================
   MERCHANTS — typed name themes the reveal
   ============================================================ */
const MERCHANTS = {
  verizon:{name:'Verizon', brand:'#cd040b', markBg:'#000000', markColor:'#ffffff',
    markBg:'transparent',   /* the asset carries its own black disc */
    mark:`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAEKtJREFUeAHtXWuMXGd5fr7vXOc+e3FiOwaPSatCRQURQamEqm5Vqah/2qhVK1QJdQVRVQmVtAiprYQUUFW1jVQlUJoAAmxDECAIIYAiAQo2AgkJERJQIAEp9ho7sb327uxlrufK857ZScbrmZ3Z2TneXSfP+t31zM455/ve816f75yzCruLMmWOUqG8ZeNnZeN3lU2fXaEs9Pw8RzlNeWbjvVcFRGF3Ux6gnKXEExLZ1/GNfZdxE2KO8hiliskpbSvpKnNfQyzhPtw4pQ2yzHlcHw72NPaC4vop8j7sA8xjsrEtLYvcc6hQTmHvKm6zPIY95Nb3Ym+566giY57HLkJi3QPYf4rbLA9gF1ChPI39q7TN8jRuoEtXsLcTxbhyFjdAiRXcnMq7IUqs4OZWXqpKrODVobzUlHgzJYxRReY8EWLiZihVxpUdlzjzAOJXufwzxkQF+7PDmLRUMWY8fAzAbg9+r8gpbBPzo+5cGTq2lYq1ZcYm+FPpLUVp/tTyOSc2jJ1PTnFfSiM2OAalhh/fkDFadmwqI4Zhch9q1GPNYxs4O9LgkwFzILaOHbgxOBGF4QJOxEw+a0xAgaAyLO6zo4jhxwbHyuNaonR5b2QFik6uy8pmH+XdhxF9Po5j/OP0URyOWrAsoOYYsCO15TY2h3LKXMN3qqtwDI1WGGInsLQJLwrx56Uy/jgswNNbf96nvvK+iUAH+I2RwServ8aIqKCTUD7c+6bq86FT2EbQ/PvcLI5bMwjbClq1EpPYCnK+L5amcOzSUwgsmo8XYSdQtgXL83H2yB04uLQCusTWG/D4mic5KgLvXa/iZGu5Y1+jQVb/jqFnFXDzbOewrYyj8KXmEtbdLKpOC23urkWn2EpqSuG2hoe3Oy6MMAOFnUH5Gn/k5HF4pY6GVkOP3+QYa6aPRSeLrzaXO449OsSFrylrNivwPmxn8Dx1bX5/vNXEVFusSw/dRvPzbb+K95UOI4iaGBeMv8kIIuXh/VMVtOMWX41wfCqsEBh4vFFHXUsEG938NnDvNfvr+b8sA1awDcihlbJwf/ssdK7EmNg5m1udVDOkFRgW/ooncyrZhwH5x2yO0cDUw9AdWwz/3G6Gr98ZZOCDFr1FNOiOKaSVxvSYj9XPc+wGxkD3YoAEvaP+S4yBHAP4s802nioFsOIwccluyuuHwAhh0wIQtvDX2Vm+E8HhxLORSqxzKJg6NcUOFLI8GXcXDiAOqnB9A74xPCGZsY/ncjGea/k8Cdu2vi5etsKuAkWr89guON+mFTJ5ZPGN6loyMUnCYglqwNjkbYva9ehC/1Q8nHww4HZMP9x2+IRUxJ1HPj+r6YIR/jV3CIEfUnnBQBeW0yJjkpNqs/h8mIlDxuwy+YyJOWyUNLrnjW2DpSviKMNR+Xh49TL8Yj5RoOhhoC3xFzQcZGgsb4wDvM3KImIsMkaMRXLMwHKlCMUfmi6ORR5cWqNSPJHR4DAgsS/mwPxsFsfXrsLM+AiRAcZLYy+7cfeIY7lvLF9Bm6VIgGro4dvK5wSbcEKLVtVfIVJCBCpC22T5UW3g76ZnoX1FC4pHcmGphO2AFsj68d3Th6GX22iZCmGS0voHQY/mpxL79PE1FaBOi/WaAU9+A2MkkS7m5Ft3xFJlVzAG2BoxMHd2dVe2gB/pIwxvXse1h5QIioW4X57BzOJPOA/aYBRgWFUoh1JWJ3suzb4Z1sp6Yo1bIaarO54J07FxZ3gOP2X40NzG5vFb4ytwgXJMxiPmWMGYiDQtJ4oTBfyktoaLeYmLow1Kiu5cs4q/dQsIYwvRCN4knwl5xt7LTOrUWDvpEbI3h1N3QpwvkSVtNBJblZPXHjXx90eFUpZdvBU7QCwxPfkPYwqV+TnWhA6zoRUOLxEkVjbpih/I3c4XTbanw6HjzrH+If86hKwAWDsN3cZl1jesAMdrteSgskUo4Sca2/q6mBMFzmFC0NrBp9depKvk4ZvDSwqxJikr7mRvWmZLFklrP8QdJZbdmrXwNi/LzBpjlEZwzQlQQBEP11/kAV1MEBVRYAUTgs3pvBBE+CGzcsZXnUIbg8O0lk6GSg+DJXzAKSfZeVhQF8v5oD0Nz1tCzY4H9h69xy41TXzXDXCZY9JhGxPEW+T4RzEhBGEsrQZOVhehMiasSOJhBDcKk+y5GTI51zOwZLTxHvt2kkzS6TswTek2ekIAu5QMN9eqQx69yz2Gqhmh3ERfC5Sk4jIhtTkWKdKjooUTK4vUKGtFtbPAtwmVbhKZCAIObioAvugtI6CrvMTupNQkwWDYUAMsy2P5kg1i3FZfx1szWZiaihPX7CmDTJ6YJj3PMFz8iZ3DkbUqt4ngC/PSx+O1ZFeeiGLLxIUiB0Tf+EqwjBw/HMQ7Y382YbIuLDbT4B6b7I8fjddwrGrBMz26pupb4SUdAm3IZAZeMdv4YOkQ/KDJvKDRO0/Z3hYOL2zi/aWDuMIQoUObHU2AQYWwlFZty8PRFRNfovJ8HsOXikHtOHFcN4eJ7VHcLiRLbgYmbs8ZeM7+XfjskyPdQADnOiuUg0sBLfFSyqDmtIkjl55Hi01+wM6CaXZjx4rhQKFIRb5w6A/gLjWkp0sKZCPqZ9sSAjzuI4O8mcEx73lcaoYsuIOkpQujySlxogEh5Bc5KirLw6/rTZxn4F7MkSVMeL/rB530xcwcwiIHnFlhPcDfODOQyJb0vBsQBod9A96Vn0VhtZkoV5hlHQ0KDOyv2evy9ODn5TYWmuQqyUDTfyeqPMFEFdgLKZI/1VrDDOs8kzXhoKakmy3FZ9kR4p7bykmc6v18SGuTJHRPuURS1INSwzpYLtOQncnzJHysXqUBG5Oo+fpioi7cC7L1sBgL10q/j9WwRrrplQN1lNNRQRKS+E0x89qRCX1LjDdfuILnvWpSJCfR0zDxe+ydny29Hq11JhjtJ6TCIMguJdbpUhEHrzyPGtdsdrj0MhBigQtIAZIhGyxfnsy1YHt9Rk8rS/paxjflCD1Dly2wh+bs33e0LDYkWmAfS4XRej504HVo1FmWiCaG9dgUh93Ht4wGVn2PCt/pwsFArKTmwogs4Yhx/5ULyLpS/W9YHL+kSdGSEVkIRzlGtzzfyLGkKTDWFT3cczCfdCgJw033s3SIu70CGmSha7bqtHNbICH78xl8YvGS5B9I+EsJC6lZoMFRx5Qn2w2sbbAnnT6UgdxiwcNCO8xoGIz1OhEmnyLJBafB94r4swM51oRW4sbvzJRgtlcxU2eGjzCQdEgMU2ICt7lMNuhJb53MDa4tyieLxALPIQXYDOAh1z7EPR/yVuh6UkxTqSbXMxwe1mF8y7KscMkCZjvLjG6OSiwXmZHP4t/e8QZyfrRCljkfKtzC9eMILZu0lJQ2fRSYlEQswiODBCtpic82uOLmSPnDFXSVmgkmFvgMUkCLWVjGbTADf7x+EUaOCSJiXKPydIa8XzZElKc1FpAoLy5SvWUqp8RiaMrEO47l6PomDioHbw+y6BpXICPu48KdBS4mLpIMOmfhfxuXcWvLRZs+bESpWeA58a0FpABTLJAdQ5Z0+0VazQ9zNdyBLCyHBKhrJzEvpCg2uTGZdbHUKOsnCjbET/UVvOeuI8j/fIlkXhtCMYrrigJVXwVqHmudlegMyYwmqnLyXFpjO+QqYCxFaho4LQo8jRTgyyTbMRfSOwskJ5druPMQUwhLFY9Jw8gyObh0uRxLEirQoPv6tDjNuCiGumqt49//9HZc+FHAXrpBN+wQCQM7MRbXEU1Z52s4vtJIVpEiEi9NxsM4pRKGeEYconsDczqIpZU38UjjKrPuDBqFFvlC3Slb8mRHyGCrIl2ZbHFc4qSLlHKIQukAssZz5P3yaDudNY2tIF1J027RSkv4QnORFttJXOmUzwkW0FPGPI4U4XNNgjaHR9QiilaGLivKCxGQrTGKYcIHhWUmlWm+z9V2Nc2pHw1R+0Yeq7TQXLNIxQxhUajfApmfk+YqOxkbsroSxymqb8Nzde+LtBAnjEsWD714iQoqw5DVRLqrabPlzzMGMhZaotBiDsZ0HUY5D2OKLeCPKbFQW/WBnUd3IT+pMEsZ/N/yEmvMYCSqf4dIjK5Xgak9d0CRaWk5a3hqJcZFWlSYYWXG0kXnKHlma2bisGDAKdZRn5qCurWBS09qFIVHZBEdxc7AfYtdSs4xgxC/sRz8ss1EIrXf9i4aGgen5VtXgStI0QplBcxk+rSZCB4802CPSnd1pIyRDoTxj2VMOMUJT7GBYzw03uigdbIGbbGOjBy2Yi0MpA9UZz04zpr4f67HOMpNaDADqSrwBDYMrreV+yhSAtMCs7JJRrmBh39xBvbsDF1XMq7EQrFCup+4cj4PNdtA7UIZ+fMN0lyRkNMDKSNJLJFuwwjo+kxGn6kvJZSaWGUbE2WeN+PlnNE7ttNIy40lHEUeuwmFOq3j2y+tMwuTOMi6zMxIOhEzz2J3qgX3tgjr/0nKnit7YrlKSU9sAQP4RId1pvTVX1R1rLBeCaV6DwCkl38XKF/vvth8clOzQkGSFUkO/M8PriJfKsAiMaBcvseuJMz7WD/AZJF9A1afqEEuou7ZctAe2WlkGEs9PHrJS7w8Ld6vBx/pfbFZgQ8i5YfYkELA98+tYJ3rwA0haUSB8pM14bTl4vK31nALF4PMEfYlUc5ixb7IlvCbQS09yuAVLGBTrtisQFFeqlYYJIvnGp/+3jqmuZxJjiERy2BmLpaw/B9nMCPWJ+3IUJAsIFP7mdo6oo3YlzJOYlPT0S9VyTJnindwa7hUYCbnYvnLb0KbxXV8kMM4RDc2D2L1wHlki1xTDmRNY+seTAafyebxOyu/wHmyLmHUTFOJC+hcYH4N+iU4scKPICXIMmaba8bVWg3PLLDtiNuJ9cQFxsCP1+Gw5CvWD5DGYqLpOb+qRxKeVS70Zbw7zTbvjCxkGc2hV2ntEH11MqhCOIGU6kKZvOlnyJQY+OjnfwXtzkqvh4zzelx96Ax51jI8q86EI4GxkxC6VJa8lKI5YWTo4tLJfGrlBRI45L41abI4tSgoWfdEv19sdcoqmOA9s70HjNlhFLgo3jQ06k/chUb5DNxLs6j9xRLydomtW9hZOOq54rTbWMj1NIru2hbm2inhwJVn+cssFzC9xJJTaOHEI+/AAMJlqzWRBaTgymIjcneBHxUQhAGeOBUjn8tj7f6rmLFzsJlY2Hsgx8X5DHVxrTBpkFSQy9WyXJR6lAojY8bF+XZysS5UKiXMv2ALtmqUoCGlzb2YMLr3eZS4+PNf734TXnrkPAqO3XOnU/wyhdWrFrkSYd0KUOYi8n+vreGy3+jsD6mUzlKRjH2/cBfdrBxPUtTGzYF5g5EruVnQ6NwwOEySuzNlSS8fF0y3cwNhOvI0JogKUnrohDKnKRYVmotNZVJ0bMltqb23qMrdnRtiUXlZbcRluWXW1Gkp7yz2x5M75B5fyQ867lw8o66VrtVd875O7hHu3FqbigLPIrUa+LUH70wEFbz26Kcdo4LXHj42ETyI/au0rsgcdvXJv/PYvw9g3HGNNylUsL8ek3IKu+SywzCP1x5COxF8GHtLkdWNMe2rp5xXsPsWuS8V1w/yPIYTuHFKk3g8h5sQ3T9GcAKT/2MED2IX/hhB6tc/DIFMVm63nUPnnr0KXrl/ebMiFnp+ivwMr6yS7dqfw/gtnsBnAcuumgEAAAAASUVORK5CYII=" alt="">`},
  netflix:{name:'Netflix', brand:'#e50914', markBg:'#000000', markColor:'#e50914'},
  amazon: {name:'Amazon',  brand:'#ff9900', markBg:'#232f3e', markColor:'#ff9900'},
  spotify:{name:'Spotify', brand:'#1db954', markBg:'#191414', markColor:'#1db954'},
  hulu:   {name:'Hulu',    brand:'#1ce783', markBg:'#0b0b0a', markColor:'#1ce783'},
  uber:   {name:'Uber',    brand:'#142328', markBg:'#000000', markColor:'#ffffff'}
};
function lum(hex){
  const n=parseInt(hex.slice(1),16), c=[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]
    .map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));
  return .2126*c[0]+.7152*c[1]+.0722*c[2];
}
function onBrand(hex){ return lum(hex)>0.42 ? '#141410' : '#f3f1ed'; }
/* suggests as soon as 2 characters could belong to a merchant name — the
   point is that the system recognises it mid-typing, not on a full match */
const DETECT_MIN = 2;
function detectMerchant(txt){
  const t=(txt||'').trim().toLowerCase();
  if(t.length < DETECT_MIN) return null;
  for(const k in MERCHANTS){
    if(k.startsWith(t) || t.startsWith(k)) return Object.assign({key:k},MERCHANTS[k]);
  }
  return null;
}

/* ============================================================
   ICONS
   ============================================================ */
const I={
  x:`<svg viewBox="0 0 24 24" fill="none" stroke="#141410" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  back:`<svg viewBox="0 0 24 24" fill="none" stroke="#141410" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>`,
  support:`<svg viewBox="0 0 24 24" fill="none" stroke="#141410" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><path d="M4 12.5h1.6A1.4 1.4 0 0 1 7 13.9v3.2a1.4 1.4 0 0 1-1.4 1.4H5a1 1 0 0 1-1-1v-5Z"/><path d="M20 12.5h-1.6a1.4 1.4 0 0 0-1.4 1.4v3.2a1.4 1.4 0 0 0 1.4 1.4H19a1 1 0 0 0 1-1v-5Z"/><path d="M17 18.5v.8a2.2 2.2 0 0 1-2.2 2.2H12"/></svg>`,
  chevD:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`,
  arrowR:`<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="#141410" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  cal:`<svg viewBox="0 0 24 24" fill="none" stroke="#141410" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17M8 3.5v3M16 3.5v3"/></svg>`,
  eye:`<svg viewBox="0 0 24 24" fill="none" stroke="#141410" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.8"/></svg>`,
  check:`<svg viewBox="0 0 24 24" fill="none" stroke="#f3f1ed" stroke-width="3.3" stroke-linecap="square"><path d="M4.6 12.4l5.3 5.3L19.4 7.2"/></svg>`,
  credit:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="8.4"/><path d="M12 12V4.2M12 12l6.4 4.4"/></svg>`,
  debit:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><rect x="2.6" y="5.6" width="18.8" height="13" rx="2.4"/><path d="M2.6 10.2h18.8M6 14.6h4"/></svg>`,
  bank:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.2 9.6 12 4.4l8.8 5.2M5.2 10.6v8M18.8 10.6v8M9.4 10.6v8M14.6 10.6v8M2.6 19.4h18.8"/></svg>`,
  del:`<svg viewBox="0 0 24 24" fill="none" stroke="#141410" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H5M11 6l-6 6 6 6"/></svg>`,
  dollar:`<svg viewBox="0 0 24 24" fill="none" stroke="#141410" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.4v9.2M14.3 9.6c0-1-1-1.6-2.3-1.6s-2.3.7-2.3 1.7 1 1.5 2.3 1.7 2.4.6 2.4 1.7-1.1 1.7-2.4 1.7-2.3-.6-2.3-1.6"/></svg>`,
  heart:`<svg viewBox="0 0 24 24" fill="none" stroke="#141410" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.6-4.7-7.6-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.6 2.8C19.6 15.3 12 20 12 20Z"/></svg>`,
  cart:`<svg viewBox="0 0 24 24" fill="none" stroke="#141410" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5h2.1l2.4 10.2h9.8l2.2-7.3H6.4"/><circle cx="9.2" cy="19" r="1.4"/><circle cx="16.6" cy="19" r="1.4"/></svg>`,
  cardic:`<svg viewBox="0 0 24 24" fill="none" stroke="#141410" stroke-width="1.5" stroke-linecap="round"><rect x="2.6" y="5.6" width="18.8" height="13" rx="2.4"/><path d="M2.6 10.2h18.8M6 14.6h4"/></svg>`,
  starsq:`<svg viewBox="0 0 24 24" fill="none" stroke="#141410" stroke-width="1.5" stroke-linecap="round"><rect x="3.4" y="6.4" width="17.2" height="11.2" rx="2"/><path d="M8 11.4v2.2M8 11.4l-1.5.9M8 11.4l1.5.9M8 13.6l-1.5-.9M8 13.6l1.5-.9M14 11.4v2.2M14 11.4l-1.5.9M14 11.4l1.5.9M14 13.6l-1.5-.9M14 13.6l1.5-.9"/></svg>`,
  asterisk:`<svg viewBox="0 0 24 24" fill="none" stroke="#141410" stroke-width="1.6" stroke-linecap="round"><path d="M12 4.2v15.6M5.2 7.8l13.6 8.4M18.8 7.8 5.2 16.2"/></svg>`,
};

const chaseLogo=`<svg class="logo" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#fff"/><g fill="#117aca"><path d="M12.1 4.6h7.8c1 0 1.9.8 1.9 1.9v3.2H9v-3.2c0-1 .8-1.9 1.9-1.9h1.2Z"/><path d="M27.4 12.1v7.8c0 1-.8 1.9-1.9 1.9h-3.2V9h3.2c1 0 1.9.8 1.9 1.9v1.2Z"/><path d="M19.9 27.4h-7.8c-1 0-1.9-.8-1.9-1.9v-3.2h13v3.2c0 1-.8 1.9-1.9 1.9h-1.4Z"/><path d="M4.6 19.9v-7.8c0-1 .8-1.9 1.9-1.9h3.2v13H6.5c-1 0-1.9-.8-1.9-1.9v-1.2Z"/></g></svg>`;

/* ============================================================
   PARTIALS
   ============================================================ */
function nav(step,total,opt){
  opt=opt||{};
  let bars='';
  for(let i=1;i<=(total||7);i++) bars+=`<i class="${i<=step?'done':''}"></i>`;
  const tone = opt.tone ? ' '+opt.tone : '';
  /* back on the left (high-frequency, matches the swipe edge),
     close on the right so the escape hatch never moves.
     noback: processing screens with nothing to go back to.        */
  const left = opt.noback
    ? `<span class="navspace"></span>`
    : `<button class="iconbtn${tone}" data-act="back">${I.back}</button>`;
  const mid = opt.noprogress ? `<div style="flex:1"></div>`
                             : `<div class="progress">${bars}</div>`;
  const right = `<button class="iconbtn${tone}" data-act="close">${I.x}</button>`;
  return `<div class="nav">${left}${mid}${right}</div>`;
}
function keyboard(live,cls){
  const k=c=>`<div class="kbkey"${live?` data-char="${c}"`:''}>${c}</div>`;
  return `<div class="kb ${cls||''}">
    <div class="kbrow">${[...'qwertyuiop'].map(k).join('')}</div>
    <div class="kbrow r2">${[...'asdfghjkl'].map(k).join('')}</div>
    <div class="kbrow"><div class="kbkey wide">&#8679;</div>${[...'zxcvbnm'].map(k).join('')}<div class="kbkey wide"${live?' data-char="\\b"':''}>&#9003;</div></div>
    <div class="kbrow"><div class="kbkey num">123</div><div class="kbkey space"${live?' data-char=" "':''}>space</div><div class="kbkey num go" data-kbgo>return</div></div>
    <div class="kbbottom"><span>&#9786;</span><span>&#127908;</span></div>
  </div>`;
}
/* iOS numeric keyboard — for digit-only fields like SSN */
function numKeyboard(){
  const SUB={'2':'ABC','3':'DEF','4':'GHI','5':'JKL','6':'MNO','7':'PQRS','8':'TUV','9':'WXYZ'};
  const k=d=>`<div class="kbkey" data-char="${d}"><b>${d}</b>${SUB[d]?`<i>${SUB[d]}</i>`:''}</div>`;
  return `<div class="kb numkb">
    <div class="kbrow">${['1','2','3'].map(k).join('')}</div>
    <div class="kbrow">${['4','5','6'].map(k).join('')}</div>
    <div class="kbrow">${['7','8','9'].map(k).join('')}</div>
    <div class="kbrow"><div class="kbkey ghost"></div>${k('0')}<div class="kbkey ghost" data-char="&#8;">&#9003;</div></div>
  </div>`;
}
function numpad(){
  return `<div class="numpad">${['1','2','3','4','5','6','7','8','9','.','0','del']
    .map(k=>`<button class="key" data-key="${k}">${k==='del'?I.del:(k==='.'?'&bull;':k)}</button>`).join('')}</div>`;
}
function acct(){
  return `<div class="acct">${chaseLogo}<div class="t"><b>Chase</b><span>Checking 1349</span></div><div class="bal">$23,230.00</div></div>`;
}

/* ============================================================
   SCREENS
   ============================================================ */
const S={};
/* html may be a function when the screen depends on live state */
function def(id,node,html,opt){ S[id]=Object.assign({id,node,html},opt||{}); }

/* per-character blur→clear stagger, ported from identity-intro.html */
function splitChars(root){
  if(!root || root.dataset.split) return;
  root.dataset.split='1';
  const walk=node=>{
    [...node.childNodes].forEach(n=>{
      if(n.nodeType===3){
        const frag=document.createDocumentFragment();
        let word=null;
        for(const ch of n.textContent){
          if(/\s/.test(ch)){ word=null; frag.appendChild(document.createTextNode(ch)); }
          else{
            if(!word){ word=document.createElement('span'); word.className='word'; frag.appendChild(word); }
            const s=document.createElement('span'); s.className='ch'; s.textContent=ch; word.appendChild(s);
          }
        }
        n.replaceWith(frag);
      } else if(n.nodeType===1 && n.tagName!=='BR') walk(n);
    });
  };
  walk(root);
  let i=0;
  root.querySelectorAll('.ch').forEach(s=>{
    s.style.transitionDelay = Math.min(i*MOTION.stagger.dur/1000, 1.1).toFixed(3)+'s';
    i++;
  });
}

const COVER_ASPECT = '1368 / 984';    /* bkgd-1, backdrop keyed out and trimmed */
const COVER_KEEP   = 170;             /* px of the cover that stay on screen */

/* ---- card orientation: the same fan, turned ----
   Two photographs and two CSS fans. Vertical is bkgd-1 — portrait cards climbing
   to the right. Horizontal is bkgd-3 — landscape cards descending to the lower
   right. They cannot share a bleed: bkgd-1's canvas is landscape and bkgd-3's is
   portrait, so rendering bkgd-3 at bkgd-1's 1.53x would draw its cards at twice
   the size. Each bleed below is solved from a measured card width instead, so a
   card lands at 174px on screen either way — literally the same card, turned.
     bkgd-2 turned left 20deg, measured: card 357.5x254.3 in a 1312px-wide
     artwork, so bleed = (174 / 357.5) * 1312 / 393 = 1.625.
   blockH is what the cover actually occupies, which the pinned screens offset by.
   In CSS-fan mode that is the fan box, not the photo: for vertical the two differ
   by 20px and the pin was tuned to the photo, so that number is kept as it was. */
const COVERS = {
  v:{ art:()=>COVER,   aspect:'1368 / 984',  bleed:1.53,  keep:170, fanH:432.5 },
  h:{ art:()=>COVER_H, aspect:'1312 / 1030', bleed:1.625, keep:170, fanH:501 }
};
const cardHz  = () => document.body.classList.contains('cardh');
const coverOf = () => COVERS[cardHz() ? 'h' : 'v'];
function coverBlockH(){
  const g=coverOf();
  if(document.body.classList.contains('fanart')) return g.fanH;
  const [aw,ah]=g.aspect.split('/').map(Number);
  return 393*g.bleed*ah/aw;
}
/* every screen mounts its cover through here, so orientation is one switch */
function mountCover(img, stick, pin){
  const g=coverOf();
  img.style.aspectRatio=g.aspect;
  img.src=g.art();
  if(stick) stick.style.top='-'+Math.round(pin(coverBlockH(), g))+'px';
}

/* ---------- nav bar — 6241:53371 ---------- */
const NAV_ICONS = {
  home:`<svg viewBox="0 0 24 24"><path d="M12 3.2 3.4 10.3v.1c0 .5.4.9.9.9h1.3v8.5c0 .6.4 1 1 1h3.1v-5.2h4.6V21h3.1c.6 0 1-.4 1-1v-8.6h1.3c.5 0 .9-.4.9-.9v-.1L12 3.2Z"/></svg>`,
  bars:`<svg viewBox="0 0 24 24"><rect x="2.6" y="14.4" width="3.6" height="6.2" rx="1.1"/><rect x="8.2" y="10.6" width="3.6" height="10" rx="1.1"/><rect x="13.8" y="6.6" width="3.6" height="14" rx="1.1"/><rect x="19.4" y="3" width="2.2" height="17.6" rx="1.1"/></svg>`,
  monitor:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V5.8A1.8 1.8 0 0 1 5.8 4H9M15 4h3.2A1.8 1.8 0 0 1 20 5.8V9M20 15v3.2a1.8 1.8 0 0 1-1.8 1.8H15M9 20H5.8A1.8 1.8 0 0 1 4 18.2V15"/><path d="M8 12h8"/></svg>`,
  guard:`<svg viewBox="0 0 24 24"><path d="M12 2.4 4.6 5.1v6.3c0 4.4 3 8.5 7.4 10.2 4.4-1.7 7.4-5.8 7.4-10.2V5.1L12 2.4Z"/></svg>`,
  identity:`<svg viewBox="0 0 24 24"><path d="M12 2.6a4.4 4.4 0 0 0-4.4 4.4v2.2H6.4A1.8 1.8 0 0 0 4.6 11v8.6a1.8 1.8 0 0 0 1.8 1.8h11.2a1.8 1.8 0 0 0 1.8-1.8V11a1.8 1.8 0 0 0-1.8-1.8h-1.2V7A4.4 4.4 0 0 0 12 2.6Zm2.4 6.6H9.6V7a2.4 2.4 0 0 1 4.8 0v2.2Z"/></svg>`
};
const NAV_ITEMS = [['home','Home'],['bars','Home'],['monitor','Monitoring'],['guard','Guard'],['identity','Identity']];
/* The cover doesn't scroll — any downward intent (wheel, swipe, or the pill)
   opens the second section as a tray sliding up over it. Letting the cover
   scroll first made the whole page move before the tray appeared. */
function armTray(wrap, open){
  wrap.style.overflowY='hidden';
  wrap.scrollTop=0;
  wrap.addEventListener('wheel', e=>{ if(e.deltaY>6) open(); }, {passive:true});
  let y0=null;
  wrap.addEventListener('touchstart', e=>{ y0=e.touches[0].clientY; }, {passive:true});
  wrap.addEventListener('touchmove', e=>{
    if(y0!==null && y0-e.touches[0].clientY>18){ y0=null; open(); }
  }, {passive:true});
  wrap.addEventListener('touchend', ()=>{ y0=null; }, {passive:true});
}
function navBar(active){
  return `<nav class="navbar"><div class="navpill">${NAV_ITEMS.map(([k,label],i)=>
    `<div class="navitem${i===active?' on':''}" data-nav="${label}">${NAV_ICONS[k]}<span>${label}</span></div>`
  ).join('')}</div></nav>`;
}



/* ---- v2: dark "card collection" section -----------------------------
   Logos lifted out of Assets/Card collection.svg. A scan band sweeps the
   field; whatever it crosses becomes "anchored" — the card settles level
   and its usage + last four are written in. */

const COLLECTION = [
  {logo:'nike',       bg:'#212126', use:'Basic',        n:'5185'},
  {logo:'disney',     bg:'#003AB3', use:'Subscription', n:'6874'},
  {logo:'twitch',     bg:'#9147FF', use:'Single use',   n:'9684'},
  {logo:'lululemon',  bg:'#D41935', use:'Free trail',   n:'1475'},
  {logo:'delta',      bg:'#000000', use:'Basic',        n:'8628'},
  {logo:'target',     bg:'#CC0000', use:'Subscription', n:'5080'},
  {logo:'hinge',      bg:'#FFFFFF', use:'Single use',   n:'1849', ink:'dark'},
  {logo:'verizon',    bg:'#000000', use:'Free trail',   n:'3569'},
  {logo:'fi',         bg:'#FFFFFF', use:'Basic',        n:'2854', ink:'dark'},
  {logo:'apple',      bg:'#DEDCD6', use:'Subscription', n:'7091', ink:'dark'},
  {logo:'twitter',    bg:'#1DA0F2', use:'Single use',   n:'8685'},
  {logo:'apple',      bg:'#DEDCD6', use:'Free trail',   n:'5039', ink:'dark'},
  {logo:'tmobile',    bg:'#E20074', use:'Basic',        n:'7238'},
  {logo:'amazon',     bg:'#F56600', use:'Subscription', n:'9908'},
  {logo:'chatgpt',    bg:'#E9E9E7', use:'Single use',   n:'2670', ink:'dark'},
  {logo:'doordash',   bg:'#FF3008', use:'Free trail',   n:'5085'},
  {logo:'chatgpt',    bg:'#E9E9E7', use:'Basic',        n:'1214', ink:'dark'},
  {logo:'att',        bg:'#009EDD', use:'Subscription', n:'4550', logoWhite:true},
  {logo:'ups',        bg:'#301506', use:'Single use',   n:'7687'},
  {logo:'linkedin',   bg:'#0A66C2', use:'Free trail',   n:'5579'},
  {logo:'att',        bg:'#009EDD', use:'Basic',        n:'3983', logoWhite:true},
  {logo:'lyft',       bg:'#EA0B8C', use:'Subscription', n:'7380'},
  {logo:'dating',     bg:'#9147FF', use:'Single use',   n:'3614', art:true, video:true},
  {logo:'airbnb',     bg:'#FF5A5F', use:'Free trail',   n:'2178'},
  {logo:'hobbes',    bg:'#908882', use:'Basic',        n:'3273', art:true, artv:'hobbesv'},
  {logo:'spotify',    bg:'#1DB954', use:'Subscription', n:'8288'},
  {logo:'hobbes',    bg:'#908882', use:'Single use',   n:'3075', art:true, artv:'hobbesv'},
  {logo:'walmart',    bg:'#1974CE', use:'Free trail',   n:'3166'},
  {logo:'starbucks',  bg:'#00703C', use:'Basic',        n:'1029'},
  {logo:'seattle',    bg:'#2360A5', use:'Subscription', n:'1087', art:true},
  {logo:'airbnb',     bg:'#FF5A5F', use:'Single use',   n:'4431'},
  {logo:'google',     bg:'#FFFFFF', use:'Free trail',   n:'4530', ink:'dark'},
  {logo:'instagram',  bg:'#EFEAEC', use:'Basic',        n:'3717', ink:'dark'},
  {logo:'hbo',        bg:'#000000', use:'Subscription', n:'3727'},
  {logo:'mayaphoto',  bg:'#3A1F14', use:'Single use',   n:'5739', art:true, artv:'mayaphotov'},
  {logo:'facebook',   bg:'#1877F2', use:'Free trail',   n:'6138'},
  {logo:'delta',      bg:'#000000', use:'Basic',        n:'4258'},
  {logo:'mcdonald',   bg:'#FDBB20', use:'Subscription', n:'9834', ink:'dark', logoWhite:true},
  {logo:'zillow',     bg:'#006AFF', use:'Single use',   n:'4355'},
  {logo:'amazon',     bg:'#F56600', use:'Free trail',   n:'3976'},
];
/* Board geometry. Card size and pitch are measured off Card collection.svg
   (291.5 x 183 cards). The board is deliberately larger than the tour: the
   camera only ever settles on an interior card, so every edge of the frame is
   filled by a neighbouring column or row instead of bare background. */
/* declared portrait, turned by cardBox() — 183x291 upright, 291x183 on its side */
const CARD_PW=183, CARD_PH=291, GAP=24;
const COLS=5, ROWS=8;
const CTR_COL=2;                       /* column that sits centred in frame */
const COL_DY=[0,0,0,0,0];              /* rows line up; no column stagger */
/* The lattice is the card plus the gap, and the centred column is inset by
   whatever is left over in the 393 frame. Both change when the card turns, so
   this is solved at mount rather than at load. */
function boardGeom(){
  const {w,h}=cardBox(CARD_PW,CARD_PH);
  const colPitch=w+GAP, rowPitch=h+GAP;
  const x0=Math.round((393-w)/2);
  const colX=[];
  for(let c=0;c<COLS;c++) colX.push(x0 + (c-CTR_COL)*colPitch);
  return {w,h,colPitch,rowPitch,x0,colX};
}
const ART_NAME = {dating:'Dating', seattle:'Travel to Seattle', mayaphoto:'Maya', hobbes:'Hobbes'};
/* these marks read correctly in their own colours against their card */
const LOGO_KEEP = new Set(['amazon','delta','disney','facebook','fi','google','hinge','instagram','linkedin','lululemon','starbucks','twitch','ups','verizon','walmart']);
/* Page two turns with page one. Card metrics are declared portrait — narrow side
   first — and swapped when the toggle is horizontal, so every screen shows the
   same card on its side rather than a second design. Turning the card is the easy
   half; each screen then has to re-solve its own framing around the new shape,
   which is what the per-screen helpers below do. */
const cardBox=(pw,ph)=> cardHz() ? {w:ph,h:pw} : {w:pw,h:ph};

/* "Pale" is a family, not a hue. #DEDCD6 and #EFEAEC each have a measurable hue,
   so anything keyed on hue alone treats two near-white cards as unrelated and
   seats them together. Value and saturation catch them instead. Shared by the
   board below and the flip wall, so both agree on what reads as white. */
function cardVS(h){
  const v=String(h).replace('#','');
  const r=parseInt(v.slice(0,2),16)/255,g=parseInt(v.slice(2,4),16)/255,b=parseInt(v.slice(4,6),16)/255;
  const mx=Math.max(r,g,b), mn=Math.min(r,g,b);
  return [mx, mx ? (mx-mn)/mx : 0];
}
function cardPale(c){
  if(!String(c.bg).startsWith('#')) return false;   /* art cards carry a photo */
  const [v,sat]=cardVS(c.bg);
  return v>0.82 && sat<0.15;
}

/* The camera frames one interior cell and you see roughly its 3x3 neighbourhood,
   so "too many white cards at once" is a per-window limit rather than a
   per-neighbour one. Column 1 held hinge, apple and chatgpt stacked, which put
   three near-white cards on screen together.
   Minimal-change by design: the order stays COLLECTION's and only offending
   cards move, each traded with the non-pale card that buys the largest drop in
   violations. Deterministic, and if it cannot reach zero it keeps the best it
   found rather than throwing the layout away. */
const BOARD_PALE_CAP=2;
const BOARD_WINDOWS=(()=>{
  const out=[];
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const cells=[];
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
      const rr=r+dr, cc=c+dc;
      if(rr>=0&&rr<ROWS&&cc>=0&&cc<COLS) cells.push(rr*COLS+cc);
    }
    out.push(cells);
  }
  return out;
})();
function boardOrder(){
  const N=COLS*ROWS;
  const cost=a=>BOARD_WINDOWS.reduce((s,cl)=>
    s+Math.max(0, cl.filter(i=>a[i]&&cardPale(a[i])).length-BOARD_PALE_CAP), 0);
  const a=COLLECTION.slice(0,N);
  for(let guard=0; guard<200; guard++){
    const cur=cost(a);
    if(!cur) break;
    let best=null;
    for(let i=0;i<N;i++){
      if(!cardPale(a[i])) continue;
      for(let j=0;j<N;j++){
        if(cardPale(a[j])) continue;
        const b=a.slice(); const t=b[i]; b[i]=b[j]; b[j]=t;
        const c=cost(b);
        if(c<cur && (!best || c<best.c)) best={c,i,j};
      }
    }
    if(!best) break;                 /* no single swap improves it; stop here */
    const t=a[best.i]; a[best.i]=a[best.j]; a[best.j]=t;
  }
  return a;
}

function collectionField(){
  let out='';
  const G=boardGeom();
  boardOrder().forEach((c,i)=>{
    const col=i%COLS, row=Math.floor(i/COLS);
    const x=G.colX[col];
    const y=row*G.rowPitch + COL_DY[col];
    /* src is attached in onEnter: DATING_BG is declared further down the file,
       and collectionField() runs while the screens are being defined. */
    const face = c.video
      ? `<video class="cc-art" data-vid="dating" src="${DATING_BG}"
                muted loop playsinline autoplay preload="auto"
                disablepictureinpicture></video>
         <span class="cc-name">${ART_NAME[c.logo]||''}</span>`
      : c.art
      ? `<img class="cc-art" src="${CARD_ART[c.logo]}" alt="">
         <span class="cc-name">${ART_NAME[c.logo]||''}</span>`
      : `<img class="cc-logo" src="${CARD_ART[c.logo]}" alt="">`;
    out+=`<div class="ccard${c.ink==='dark'?' ink-dark':''}${LOGO_KEEP.has(c.logo)?' logo-keep':''}${c.logoWhite?' logo-lite':''}" data-i="${i}"
        data-n="${c.n}" data-use="${c.use}"
        style="left:${x}px;top:${y}px;background:${c.bg};--ph:${-(i%4)*1.7}s">
        ${face}
        <span class="cc-num"></span>
        <div class="cc-foot"><span class="cc-use"></span></div>
      </div>`;
  });
  return `<div class="ccstage"><div class="ccplane"><div class="ccfield">${out}</div></div></div>`;
}

/* The camera tour. Only interior cells (columns 1-3, rows 2-5) are ever
   framed, which guarantees a ring of cards outside the viewport on all four
   sides. Every hop changes BOTH column and row, so the camera only ever
   travels diagonally — never straight up/down or straight across. */
const CAM_CELLS=[[1,2],[2,3],[3,4],[2,5],[1,4],[2,2],
                 [3,3],[2,4],[1,5],[3,2],[1,3],[3,5]];
const CAM_TOUR=CAM_CELLS.map(([c,r])=>r*COLS+c);

/* On arrival the usage and the last four don't fade in — they land as a
   randomised code that churns and then settles, left to right. */
const GLYPHS='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%&0123456789';
const DIGITS='0123456789';
function scramble(el,target,dur){
  if(el._scr) clearInterval(el._scr);      /* never let two runs fight */
  const chars=[...target], steps=Math.max(5,Math.round(dur/48));
  let f=0;
  /* start already churning: a row of zeros flashed for a frame now that the
     scramble begins while the card is still moving */
  /* anything that is not a letter or digit is punctuation and stays put — it used
     to test for '.' and ' ' specifically, so the new middle dots churned */
  const fixed=ch=>!/[0-9A-Za-z]/.test(ch);
  const rnd=ch=>fixed(ch)?ch:(/[0-9]/.test(ch)?DIGITS:GLYPHS)[
    Math.floor(Math.random()*(/[0-9]/.test(ch)?DIGITS:GLYPHS).length)];
  el.textContent=chars.map(rnd).join('');
  const id=el._scr=setInterval(()=>{
    if(!el.isConnected){ clearInterval(id); return; }
    f++;
    const settled=Math.round(chars.length*f/steps);
    el.textContent=chars.map((ch,i)=>{
      if(i<settled||fixed(ch)) return ch;
      const pool=/[0-9]/.test(ch)?DIGITS:GLYPHS;
      return pool[Math.floor(Math.random()*pool.length)];
    }).join('');
    if(f>=steps){ clearInterval(id); el._scr=null; el.textContent=target; }
  },48);
}
function revealCard(card, dur){
  const d = dur || 480;
  scramble(card.querySelector('.cc-use'), card.dataset.use, d*0.8);
  /* four dots then the last four digits, the way a masked card number reads */
  scramble(card.querySelector('.cc-num'), '\u00b7\u00b7\u00b7\u00b7 '+card.dataset.n, d);
}

/* ---- the fan, rebuilt in CSS ----
   Geometry measured from bkgd-1.png: card 109x174 r12, tilt about -6deg, and
   a fan pitch of (75,-37) that spans 600x431 on screen. */
const FAN_X0=-95, FAN_Y0=246, FAN_DX=75, FAN_DY=-37, FAN_HERO=3;
/* The turned fan, measured off the rotated bkgd-2. Its stack is deliberately
   irregular — the per-card steps run anywhere from 66 to 121px — so a staircase
   fit gives nothing stable to average. Instead the fan axis comes from a PCA of
   the artwork's own silhouette (+42.4deg) and the pitch from its extent along
   that axis: 1552.6px total, less the 427.6px one card spans, over 7 gaps = 160.7
   artwork px, which at this bleed is (57.8, 52.7) on screen. Well-conditioned
   measurements only, rather than averaging six unreliable ones.
   Card centres, not corners: a card is positioned unrotated and then spun about
   its middle, so working from corners would slide every card sideways.
   Anchored on the hero, not on card 0: the fan's own extremes are a biased
   reference for an irregular stack, and what matters visually is that the black
   Cloaked card lands in the same place in both art modes. Its centre measures
   (680.8, 575.9) in the artwork, which is frame (208.6, 282.3), and the CSS hero
   is index 3, so card 0's centre is that less three pitches. */
const HAN_X0=-51.8, HAN_Y0=69.2, HAN_DX=57.8, HAN_DY=52.7;

const FAN=[
  {g:'blue',   mark:'zillow',    rot:-9.5, hrot:-5.2, si:.30, ca:'152deg'},
  {g:'green',  mark:'spotify',   rot:-8.4, hrot:-4.7, si:.34, ca:'168deg'},
  {g:'rose',   mark:'instagram', rot:-7.0, hrot:-8.9, si:.26, ca:'141deg'},
  /* the hero is shot flatter than its neighbours, so after the turn it reads as
     the most tilted: -19.3 against their -5 to -10 */
  {g:'black',  cloaked:1, mc:1,  rot:-5.8, hrot:-19.3, si:.22, ca:'160deg'},
  {g:'lav',    mark:'nike',      rot:-4.6, hrot:-10.0, si:.34, ca:'147deg'},
  {g:'brown',  mark:'ups',       rot:-3.4, hrot:-8.8, si:.30, ca:'173deg'},
  {g:'maroon', mark:'airbnb',    rot:-2.2, hrot:-6.4, si:.24, ca:'156deg'}
];
const FAN_G={
  blue:  'linear-gradient(162deg,#cbdcee 0%,#a8c6e0 52%,#c2d8ea 100%)',
  gold:  'linear-gradient(162deg,#eed9a0 0%,#d3ab55 52%,#e6cd8b 100%)',
  green: 'linear-gradient(162deg,#8fe3ac 0%,#33bb65 52%,#6fd292 100%)',
  brown: 'linear-gradient(162deg,#a07b57 0%,#6b4527 52%,#8a6340 100%)',
  rose:  'linear-gradient(162deg,#efd0c3 0%,#d3a08d 52%,#e8c4b4 100%)',
  black: 'linear-gradient(162deg,#2a2a2c 0%,#141416 52%,#232325 100%)',
  lav:   'linear-gradient(162deg,#d8d0ec 0%,#b0a3d3 52%,#cbc2e5 100%)',
  silver:'linear-gradient(162deg,#f0f0f3 0%,#cdcdd2 52%,#e6e6ea 100%)',
  maroon:'linear-gradient(162deg,#9a464e 0%,#742c34 52%,#8c3b43 100%)'
};
/* Both geometries ship on every card as custom properties and the stylesheet
   picks one. The screens' HTML is built once at load, so orientation cannot be a
   JS branch in here — nothing would rebuild when the toggle flips. Note left/top
   are vars too: an inline left would outrank any rule trying to move the card. */
function cardFan(){
  const step=i=>i-FAN_HERO;              /* right of Cloaked comes forward */
  return `<div class="cardfan">${FAN.map((f,i)=>{
    const d=step(i);
    return `<div class="fcard" style="
         background:${FAN_G[f.g]};
         --vx:${FAN_X0+i*FAN_DX}px;--vy:${FAN_Y0+i*FAN_DY}px;--vrot:${f.rot}deg;
         --vdx:${-d*FAN_DX}px;--vdy:${-d*FAN_DY}px;
         --hx:${(HAN_X0+i*HAN_DX).toFixed(1)}px;--hy:${(HAN_Y0+i*HAN_DY).toFixed(1)}px;
         --hrot:${f.hrot}deg;
         --hdx:${(-d*HAN_DX).toFixed(1)}px;--hdy:${(-d*HAN_DY).toFixed(1)}px;
         --z:${d*30}px;
         --si:${f.si};--ca:${f.ca};--rimph:${(-i*2.3).toFixed(1)}s;--bdel:${i*45}ms;
         animation-delay:${420+Math.abs(d)*105}ms;z-index:${i}">
      ${f.cloaked?`<img class="fcloaked" src="${CLOAKED_PAY_MARK}" alt="">`:''}
      ${f.mark?`<img class="fmark" src="${CARD_ART[f.mark]}" alt="">`:''}
      ${f.mc?`<svg class="fmc" viewBox="0 0 42 26" aria-hidden="true">
           <defs><linearGradient id="mcEtch" x1="0" y1="0" x2="1" y2="1">
             <stop offset="0"   stop-color="#000" stop-opacity=".55"/>
             <stop offset=".42" stop-color="#fff" stop-opacity=".70"/>
             <stop offset=".62" stop-color="#fff" stop-opacity=".32"/>
             <stop offset="1"   stop-color="#000" stop-opacity=".50"/>
           </linearGradient></defs>
           <circle cx="15" cy="13" r="9.4" stroke="url(#mcEtch)"/>
           <circle cx="27" cy="13" r="9.4" stroke="url(#mcEtch)"/>
         </svg>`:''}
    </div>`;}).join('')}</div>`;
}



def('intro-v1','6307:9790 — v1',`
  <div class="v2root" id="v2Root">
    <div class="v2coverwrap" id="v2CoverWrap">
      ${cardFan()}<div class="coverbleed"><img id="v2Cover" src="" alt="Fan of Cloaked virtual cards"></div>
    </div>

    <div id="ccMount"></div>
    <div class="v2scrim" id="v2Scrim"></div>

    <div class="v2copy" id="v2Copy">
      <div class="swap" id="v2A">
        <h1>We block your phone scams. Now, let's block your financial scams.</h1>
        <p>Mask and protect your true payment information with Cloaked virtual cards.</p>
      </div>
      <div class="swap down" id="v2B">
        <h1>A virtual card for every need</h1>
        <p>Instant virtual cards + privacy controls <span class="nobr">built with Mastercard</span></p>
      </div>
    </div>

    <div class="v2top" id="v2Top">
      <span class="v2brand">Cloaked Pay</span>
      <button class="v2skip" data-skip="1" data-go="welcome">Skip intro</button>
    </div>

    <div class="v2cue" id="v2Cue"><button class="cuepill" data-cuejump="1">Our solution ${I.chevD}</button></div>
    <div class="v2cta" id="v2Cta">
      <button class="btn onbrand" data-go="welcome">Protect my payment method</button>
    </div>

    <div class="v2scroll" id="v2Scroll"><div class="v2spacer"></div></div>
  </div>
`,{ notop:true, enter:'fade', onEnter(el){
  const root=el.querySelector('#v2Root');
  const sc=el.querySelector('#v2Scroll');
  const coverWrap=el.querySelector('#v2CoverWrap');
  const img=el.querySelector('#v2Cover');
  mountCover(img);

  /* ---- title: per-word mask rise, lifted from the reference ---- */
  const A=el.querySelector('#v2A'), B=el.querySelector('#v2B');
  function wrapWords(box){
    const h=box.querySelector('h1');
    const parts=h.textContent.trim().split(/\s+/)
      .map(w=>'<span class="w"><span class="wi">'+w+'</span></span>');
    /* A non-breaking space does NOT hold two words together here: each word is
       an inline-block, which UAX #14 treats as class CB, and rule LB20 allows a
       break on either side of it whatever the text between says. The last pair
       has to be wrapped in a nowrap box instead. */
    h.innerHTML = parts.length>2
      ? parts.slice(0,-2).join(' ')+' <span class="nobr">'+parts.slice(-2).join(' ')+'</span>'
      : parts.join(' ');
    h.querySelectorAll('.wi').forEach((n,i)=>{ n.style.transitionDelay=(i*55)+'ms'; });
  }
  wrapWords(A); wrapWords(B);
  requestAnimationFrame(()=>A.classList.add('on'));
  let second=null;
  const swapTo=(s)=>{
    if(s===second) return; second=s;
    A.classList.toggle('up', s);   A.classList.toggle('on', !s);
    B.classList.toggle('down', !s); B.classList.toggle('on', s);
  };

  const cue=el.querySelector('#v2Cue'), cta=el.querySelector('#v2Cta');
  const skip=el.querySelector('[data-skip]');
  let fanOut=false;
  const replayFan=()=>{
    /* .back stays on from the first return, so fanOut only ever plays on entry */
    el.querySelectorAll('.fcard').forEach(c=>{
      c.classList.add('back');
      c.style.animation='none'; void c.offsetWidth; c.style.animation='';
    });
  };
  /* The board is built here rather than in the template: the template string is
     made once at load, and the camera reads each card's inline left/top, so the
     tiles have to be laid out for whichever orientation is live at mount. */
  el.querySelector('#ccMount').innerHTML=collectionField();
  const stage=el.querySelector('.ccstage');
  const scrim=el.querySelector('#v2Scrim');
  const field=el.querySelector('.ccfield');
  const plane=el.querySelector('.ccplane');
  const cards=[...el.querySelectorAll('.ccard')];
  el.querySelectorAll('video[data-vid="dating"]').forEach(v=>{
    v.muted=true; v.playsInline=true;
    const pr=v.play(); if(pr&&pr.catch) pr.catch(()=>{});
  });

  /* ---- the camera over the board (unchanged) ---- */
  /* Sit the card exactly halfway between the end of the copy and the top of
     the CTA, now that the nav bar is gone. Derived, not eyeballed:
       copy bottom 273 = 141 + two 32/1.1 lines + 20 + two 16/1.3 lines
       CTA top     752 = 852 - 44 (bottom) - 56 (.btn height)             */
  const V2_COPY_BOTTOM=273, V2_CTA_TOP=852-44-56;
  const BG=boardGeom();
  const FOCUS_X=BG.x0, FOCUS_Y=Math.round((V2_COPY_BOTTOM+V2_CTA_TOP-BG.h)/2);
  const ms=(v,fb)=>{
    const raw=getComputedStyle(field).getPropertyValue(v).trim();
    if(!raw) return fb;
    return raw.endsWith('ms') ? parseFloat(raw) : parseFloat(raw)*1000 || fb;
  };
  let ci=0, t1=null, t2=null, running=false, px=0, py=0;
  const hop=()=>{
    if(!field.isConnected) return;
    const c=cards[CAM_TOUR[ci % CAM_TOUR.length]];
    const nx=FOCUS_X - parseFloat(c.style.left);
    const ny=FOCUS_Y - parseFloat(c.style.top);
    const dist=Math.hypot(nx-px, ny-py);
    const cs=getComputedStyle(field);
    const cap=parseFloat(cs.getPropertyValue('--mb-max'))||6;
    field.style.setProperty('--mb', Math.min(cap, dist/78).toFixed(1)+'px');
    const tmax=parseFloat(cs.getPropertyValue('--tilt-max'))||9;
    const cl=v=>Math.max(-tmax, Math.min(tmax, v));
    plane.style.setProperty('--ty', cl((nx-px)/58).toFixed(2)+'deg');
    plane.style.setProperty('--tx', cl(-(ny-py)/74).toFixed(2)+'deg');
    field.classList.remove('moving');
    void field.offsetWidth;
    field.classList.add('moving');
    field.style.setProperty('--cx', nx+'px');
    field.style.setProperty('--cy', ny+'px');
    px=nx; py=ny;
    cards.forEach(x=>x.classList.toggle('focus', x===c));
    /* The digits churn for the length of the glide, so they are already running
       while the card travels and land exactly as it settles — rather than
       sitting blank until it arrives. */
    const GLIDE=ms('--dur-cam',1000);
    c.classList.add('anchored');
    revealCard(c, GLIDE);
    t1=setTimeout(()=>{ ci++; hop(); }, GLIDE + ms('--hold-cam',850));
  };
  const startCam=()=>{
    if(running) return; running=true;
    field.style.transitionDuration='0ms';
    hop();
    field.classList.remove('moving');
    setTimeout(()=>{ field.style.transitionDuration=''; },60);
  };
  const stopCam=()=>{
    clearTimeout(t1); clearTimeout(t2); running=false; ci=0; px=0; py=0;
    field.classList.remove('moving');
    field.style.removeProperty('--cx'); field.style.removeProperty('--cy');
    cards.forEach(c=>{
      c.classList.remove('anchored','focus');
      [c.querySelector('.cc-use'), c.querySelector('.cc-num')].forEach(x=>{
        if(x._scr){ clearInterval(x._scr); x._scr=null; }
        x.textContent='';
      });
    });
  };

  /* ---- one progress value drives the whole surface ---- */
  /* page colour follows the Theme switch; the board end is always dark */
  const lightUI=document.body.classList.contains('lightcover');
  const LIGHT=lightUI?[244,236,233]:[20,20,16], DARK=[20,20,16];
  const INK=lightUI?[20,20,16]:[255,255,255], CREAM=[255,255,255];
  const lerp=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
  const mix=(a,b,t)=>`rgb(${lerp(a,b,t).join(',')})`;
  const cl01=v=>Math.max(0,Math.min(1,v));
  let p=0;
  function apply(){
    const dark=cl01((p-0.05)/0.45);                    /* light -> dark */
    root.style.background=mix(LIGHT,DARK,dark);
    root.style.color=mix(INK,CREAM,dark);
    coverWrap.style.opacity=String(1-cl01((p-0.02)/0.38));
    coverWrap.style.transform=`translateY(${(-70*cl01(p/0.5)).toFixed(1)}px)`;
    const board=cl01((p-0.30)/0.30);
    stage.style.opacity=String(board);
    /* the headline reads over solid brand colours only with a scrim behind it */
    const [r,g,b]=lerp(LIGHT,DARK,dark);
    scrim.style.background=`linear-gradient(180deg,rgba(${r},${g},${b},.97) 0%,`
      +`rgba(${r},${g},${b},.99) 40%,rgba(${r},${g},${b},.88) 60%,`
      +`rgba(${r},${g},${b},.52) 80%,rgba(${r},${g},${b},0) 100%)`;
    scrim.style.opacity=String(board);
    cue.classList.toggle('gone', p>0.02);
    cta.classList.toggle('in', p>0.62);
    /* at the end the header offers the way back, and uses the same glide */
    if(skip){
      const atEnd = p>0.62;
      if(atEnd!==skip._end){ skip._end=atEnd; skip.textContent = atEnd?'Restart':'Skip intro'; }
    }
    /* returning to the cover replays the fan with its own per-card delays, so
       the cards step back rather than all arriving together */
    if(p<0.08){ if(fanOut){ fanOut=false; replayFan(); } } else fanOut=true;
    swapTo(p>0.30);
    /* Both of these are visible from p=0.30 but used to only run above 0.55, so a
       scroll that came to rest between the two left the artwork on screen and
       motionless — and the stop path blanks every usage and number, so the cards
       sat there painted but wordless. That is the "stuck on page two". Start as
       soon as it is meaningfully visible, and keep the start and stop thresholds
       apart: with a single threshold, jitter at the boundary starts and stops it on
       alternate scroll events, re-blanking the cards each time. The flip wall
       already worked this way. */
    if(p>0.34) startCam(); else if(running && p<0.28) stopCam();
  }
  const read=()=>{
    const max=sc.scrollHeight-sc.clientHeight;
    p = max>0 ? sc.scrollTop/max : 0;
    apply();
  };
  sc.addEventListener('scroll', read, {passive:true});
  el.addEventListener('click', e=>{
    if(e.target.closest('[data-cuejump]')){
      sc.scrollTo({top:sc.scrollHeight-sc.clientHeight, behavior:'smooth'});
    }
  });
  sc.scrollTop=0; apply();
}});

/* ---- v3: the merchant ring and the card it feeds ---- */
/* Centre the ring between the end of the copy (y=273) and the top of the CTA
   (y=752), the same rule the v2 board uses. At 455 the topmost mark sat at
   y=273 — exactly on the subtitle. */
const R3_COPY_BOTTOM=273, R3_CTA_TOP=852-44-56;
const R3_CX=196.5, R3_CY=(R3_COPY_BOTTOM+R3_CTA_TOP)/2, R3_RX=163, R3_RY=170;
/* these marks are drawn in near-black, so they need inverting on a dark field */
const RING_INVERT = new Set(['apple','chatgpt','hbo','hinge','nike']);
/* only merchants with a real mark can sit on the ring (no photo/video faces) */
/* Several marks are not centred inside their own 40x40 canvas — hinge sits high
   and left, nike low, walmart high — and object-fit centres the canvas, not the
   ink, which is what pulled them off the circle. Measured ink-centre offsets,
   scaled to the 30px chip. */
const RING_NUDGE={apple:[0.7,0.8], doordash:[2.0,-0.1], hbo:[-1.4,2.3], hinge:[-3.7,4.3], lyft:[0.1,-2.2], maya:[-0.8,-0.8], mcdonald:[-0.6,0.0], nike:[-1.1,3.8], tmobile:[-0.8,0.8], twitter:[-0.4,0.0], walmart:[-2.7,2.7]};
const ringNudge=c=>RING_NUDGE[c.logo]||[0,0];
/* Brands alone read as "a card per merchant"; the imagery cards on the ring make
   it "a card for whatever you need". */
const R3_UNIQ = COLLECTION.filter((c,i,a)=>a.findIndex(x=>x.logo===c.logo)===i);
const R3 = (()=>{
  const art=R3_UNIQ.filter(c=>c.art), brand=R3_UNIQ.filter(c=>!c.art);
  const out=brand.slice(0,20-art.length);
  art.forEach((a,k)=>out.splice(Math.round((k+1)*out.length/(art.length+1))+k,0,a));
  return out;
})();
function r3Media(c, cls){
  const src = CARD_ART[c.logo+'v'] || CARD_ART[c.artv] || CARD_ART[c.logo];
  return c.video
    ? `<video class="${cls}" src="${DATING_BG}" muted loop playsinline autoplay
              preload="auto" disablepictureinpicture></video>`
    : `<img class="${cls}" src="${src}" alt="">`;
}
function ringField(){
  const chips = R3.map((c,i)=>{
    if(c.art) return `<div class="r3chip photo" data-r="${i}">${r3Media(c,'')}</div>`;
    return `<div class="r3chip${RING_INVERT.has(c.logo)?' inv':''}" data-r="${i}">
        <img src="${CARD_ART[c.logo]}" alt=""></div>`;
  }).join('');
  return `<div class="r3stage" id="r3Stage">${chips}
      <div class="r3card" id="r3Card" style="--r3cy:${R3_CY}px">
        <!-- left empty on purpose: an <img> with no src renders as a broken-image
             box, and .r3face img inverts it, which is the white square that used
             to sit on the card until the ring started painting -->
        <div class="r3face" id="r3A"></div>
        <div class="r3face r3in" id="r3B"></div>
        <div class="r3glow"></div>
        <span class="cc-num r3num"></span>
        <span class="cc-use r3use"></span>
      </div>
    </div>`;
}

/* ---- v5: the flip wall ---- */
/* six columns, not five: the rows drift 26px each way now and a 5-wide grid
   uncovered the right edge at the extreme. */
const F5_GAP=8;
/* The wall cannot just swap its tile's width and height: a landscape tile makes
   the lattice wide and shallow, and six rows of 100px would leave 252px of the
   frame bare. So each orientation gets its own grid, sized to cover 852px, and
   both land on 36 slots — which matters, because 36 slots against 33 unique faces
   means only three repeats, and those hide in the veiled rows under the scrim.
   Four columns of 154px still gives a 616px loop period, comfortably more than
   the 539px (frame + tile) a card and its twin need to stay apart.
   The upright numbers are exactly what they were, including the seat slots, so
   the wall you have already approved is untouched. */
const F5_GRIDS={
  v:{w:92, h:146, cols:6, rows:6, shownFrom:2, x0:-60, y0:-46,
     rowDx:[0,-30,-12,-36,-20,-28], seats:[13,24,34]},
  h:{w:146, h:92, cols:4, rows:9, shownFrom:4, x0:-70, y0:-30,
     rowDx:[0,-46,-18,-58,-28,-70,-24,-52,-36], seats:[18,25,32]}
};
const f5Grid=()=>F5_GRIDS[cardHz()?'h':'v'];
/* On a pure-black stage a #000 card reads as a hole in the wall — an unloaded
   tile — rather than a black card. The neutral darks get lifted to greys that
   still read as black but hold an edge, well clear of the blank frame's #17171a.
   Keyed by colour, not by brand, so this stays true if the palette changes.
   Brand darks that carry hue (UPS brown, Maya's plum) are left alone. */
const F5_LIFT={'#000000':'#2b2b31','#212126':'#33333a'};
const f5Bg=bg=>F5_LIFT[String(bg).toLowerCase()]||bg;
const F5_SHOWN_FROM=2;
/* Each row is emitted twice: the twin sits one full period along, which is what
   makes an endless one-way loop possible — far enough that a card and its twin
   are never on screen together. Rows below shownFrom sit under the near-opaque
   part of the scrim, so they are filler and may repeat a face. */
const F5_REPS=2;
/* the wall runs the full height now; the scrim over the copy is what hides the
   top rows rather than starting the grid below the text */
/* Logos that ship with their own background plate have the glyph inset inside
   it, so they read smaller than a bare mark at the same box size. The card
   colour already matches the plate, so scaling the whole image up is safe. */
const F5_BIG=new Set(['twitch','amazon','linkedin','lululemon','verizon']);
const F5_XL =new Set(['disney']);        /* wide wordmark: bigger again, and higher */
/* every row starts at a different x so the wall courses like brickwork
   instead of lining up in rigid columns */
const F5_ROW_DX=[0,-30,-12,-36,-20,-28];   /* shallow so a drifting row still covers both edges */
const F5_DROP=new Set();                 /* instagram is a light card now, so nothing is excluded */
/* a fixed pseudo-random so the wall turns unevenly but identically every run */
const f5rand=i=>{const x=Math.sin(i*127.1+i*i*0.37)*43758.5453; return x-Math.floor(x);};
function flipWall(){
  /* Shadowing the module-level names with this orientation's grid, so everything
     below reads the same as it did when there was only one. */
  const G=f5Grid();
  const F5_COLS=G.cols, F5_ROWS=G.rows, F5_W=G.w, F5_H=G.h;
  const F5_SHOWN_FROM=G.shownFrom, F5_X0=G.x0, F5_Y0=G.y0, F5_ROW_DX=G.rowDx;
  const F5_PITCH=F5_W+F5_GAP, F5_PERIOD=F5_COLS*F5_PITCH;
  const F5_LOOP_S=Math.round(F5_PERIOD/1.68);   /* 1.68px/s either way */
  const seen=new Set(), uniq=[];
  COLLECTION.forEach(c=>{ if(!seen.has(c.logo)){ seen.add(c.logo); uniq.push(c); } });
  const art=uniq.filter(c=>c.art), plain=uniq.filter(c=>!c.art && !F5_DROP.has(c.logo));
  const hue=h=>{
    const v=h.replace('#','');
    const r=parseInt(v.slice(0,2),16)/255,g=parseInt(v.slice(2,4),16)/255,b=parseInt(v.slice(4,6),16)/255;
    const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;
    if(!d) return -1;
    let x = mx===r ? ((g-b)/d+6)%6 : mx===g ? (b-r)/d+2 : (r-g)/d+4;
    return x*60;
  };
  /* see cardPale above — one definition, shared with the board */
  const pale=cardPale;
  const family=c=>{
    if(pale(c)) return 'pale';
    const h=hue(c.bg);
    return h<0 ? 'neutral' : String(Math.floor(h/45));
  };
  const alike=(a,b)=>{
    if(pale(a) && pale(b)) return true;
    const ha=hue(a.bg), hb=hue(b.bg);
    if(ha<0 && hb<0) return true;
    if(ha<0 || hb<0) return false;
    const d=Math.abs(ha-hb);
    return Math.min(d,360-d)<40;
  };
  const N=F5_COLS*F5_ROWS, SHOWN=F5_SHOWN_FROM*F5_COLS;
  const interior=i=>{ const c=i%F5_COLS; return c>0 && c<F5_COLS-1; };
  const rowOf=i=>Math.floor(i/F5_COLS);

  /* Fill the rows you can actually see first, capping how many cards may share
     a colour family — eight of thirty were blue before. Rows 0-1 then take
     whatever is left over, repeats included, since the scrim hides them. */
  const order=[];
  for(let i=SHOWN;i<N;i++) order.push(i);
  for(let i=0;i<SHOWN;i++) order.push(i);

  const build=(off)=>{
    const rot=plain.slice(off).concat(plain.slice(0,off));
    const out=new Array(N).fill(null);
    const used=new Set(), count={};
    const CAP=2;
    const place=(i,f)=>{ out[i]=f; used.add(f.logo); count[family(f)]=(count[family(f)]||0)+1; };
    /* Cards that must be seen are seated first, at slots picked to be far apart:
       the three photo/video faces, plus the light ones, which the pale cap would
       otherwise push into the veiled rows. */
    const artSlots=order.filter(i=>rowOf(i)>=3 && interior(i));
    art.forEach((a,k)=>{ const i=artSlots[k*5 % artSlots.length]; if(i!==undefined && !out[i]) place(i,a); });
    [['apple',G.seats[0]],['chatgpt',G.seats[1]],['instagram',G.seats[2]]].forEach(([logo,slot])=>{
      const f=rot.find(x=>x.logo===logo && !used.has(x.logo));
      if(f && !out[slot]) place(slot,f);
    });
    for(const i of order){
      if(out[i]) continue;
      const nb=[];
      const c=i%F5_COLS, r=rowOf(i);
      if(c>0) nb.push(out[i-1]);
      if(r>0) nb.push(out[i-F5_COLS]);
      if(r>0&&c>0) nb.push(out[i-F5_COLS-1]);
      if(r>0&&c<F5_COLS-1) nb.push(out[i-F5_COLS+1]);
      const shown=i>=SHOWN;
      const cap=f=>family(f)==='pale' ? 3 : CAP;
      const fits=f=>!nb.some(n=>n&&alike(f,n)) && (!shown || (count[family(f)]||0)<cap(f));
      /* A visible slot must never reuse a face — the old fallback chain could,
         which is how hinge ended up in the wall twice. Repeats are only allowed
         in the veiled rows, where the scrim hides them. */
      /* Each row is emitted twice for the endless loop, so a face repeated inside
         one row would put the same card on screen twice. Only 33 unique faces
         cover 36 slots, so repeats are unavoidable — they just have to land in
         different rows. */
      const rw=rowOf(i);
      const inRow=x=>out.some((o,k)=>o && rowOf(k)===rw && o.logo===x.logo);
      let f = rot.find(x=>!used.has(x.logo) && fits(x))
           || rot.find(x=>!used.has(x.logo) && !nb.some(n=>n&&alike(x,n)))
           || rot.find(x=>!used.has(x.logo));
      if(!f && !shown) f = rot.find(x=>!inRow(x) && !nb.some(n=>n&&alike(x,n)))
                        || rot.find(x=>!inRow(x));
      if(!f) f = rot.find(x=>!inRow(x)) || rot[i%rot.length];
      place(i,f);
    }
    /* Final sweep. Seating order cannot guarantee that two pale cards never end
       up touching, so trade one of any offending pair with a non-pale tile from
       elsewhere in the visible band. Both stay in view either way. */
    const nbsOf=k=>{
      const c=k%F5_COLS, r=rowOf(k), o=[];
      if(c>0) o.push(k-1);
      if(c<F5_COLS-1) o.push(k+1);
      if(k-F5_COLS>=SHOWN) o.push(k-F5_COLS);
      if(k+F5_COLS<N) o.push(k+F5_COLS);
      return o;
    };
    for(let pass=0; pass<4; pass++){
      let moved=false;
      for(let i=SHOWN;i<N;i++){
        const c=i%F5_COLS;
        for(const j of [c<F5_COLS-1?i+1:-1, i+F5_COLS<N?i+F5_COLS:-1]){
          if(j<0 || !out[i] || !out[j]) continue;
          if(!(pale(out[i]) && pale(out[j]))) continue;
          const k=[...Array(N).keys()].find(k=>k>=SHOWN && out[k] && k!==i && k!==j
            && !pale(out[k])
            && !nbsOf(j).some(x=>x!==j && out[x] && pale(out[x]) && x!==i)
            && !nbsOf(k).some(x=>out[x] && pale(out[x])));
          if(k!==undefined){ const t=out[j]; out[j]=out[k]; out[k]=t; moved=true; }
        }
      }
      if(!moved) break;
    }
    let bad=0;
    for(let i=SHOWN;i<N;i++){
      const c=i%F5_COLS, r=rowOf(i);
      if(c<F5_COLS-1 && alike(out[i],out[i+1])) bad++;
      if(i+F5_COLS<N && alike(out[i],out[i+F5_COLS])) bad++;
    }
    return {out,bad};
  };
  let best=null;
  for(let off=0; off<plain.length; off++){
    const t=build(off);
    if(!best || t.bad<best.bad) best=t;
    if(best.bad===0) break;
  }
  const faces=best.out;
  /* Art-directed swaps, in the order they were asked for and keyed by name
     rather than index, so they survive the solver picking a different layout. */
  const F5_SWAPS=[['mayaphoto','apple'],['tmobile','mayaphoto'],['tmobile','hinge']];
  F5_SWAPS.forEach(([a,b])=>{
    const i=faces.findIndex(f=>f&&f.logo===a), j=faces.findIndex(f=>f&&f.logo===b);
    if(i>=0 && j>=0){ const t=faces[i]; faces[i]=faces[j]; faces[j]=t; }
  });

  let out='';
  for(let row=0; row<F5_ROWS; row++){
    for(let j=0; j<F5_COLS*F5_REPS; j++){
      const col=j%F5_COLS;                  /* the twin repeats the same face */
      const i=row*F5_COLS+col;
      const c=faces[i];
      const x=F5_X0+(F5_ROW_DX[row]||0)+j*F5_PITCH, y=F5_Y0+row*(F5_H+F5_GAP);
      /* the wave is anchored to the first visible row, so it reads as starting at
         the top-left of what you can see rather than mid-sequence */
      const wave=col + Math.max(0,row-F5_SHOWN_FROM);
      const del=Math.round(160 + wave*130 + f5rand(i)*40);
      const dur=Math.round(780 + f5rand(i+91)*560);
      const cls=(c.ink==='dark'?' ink-dark':'')+(LOGO_KEEP.has(c.logo)?' logo-keep':'')
              + (c.logoWhite?' logo-lite':'') + (F5_BIG.has(c.logo)?' big':'')
              + (F5_XL.has(c.logo)?' xl':'');
      const artSrc = CARD_ART[c.logo+'v'] || CARD_ART[c.artv] || CARD_ART[c.logo];
      const face = c.video
        ? `<video class="f5art" src="${DATING_BG}" muted loop playsinline autoplay
                  preload="auto" disablepictureinpicture></video>
           <span class="f5name">${ART_NAME[c.logo]||''}</span>`
        : c.art ? `<img class="f5art" src="${artSrc}" alt="">
                   <span class="f5name">${ART_NAME[c.logo]||''}</span>`
                : `<img src="${CARD_ART[c.logo]}" alt="">`;
      /* per-card wobble: amplitude and a touch of cross-axis roll, so no two
         cards settle the same way */
      const amp=(9 + f5rand(i+7)*11).toFixed(1);
      const axw=(1.5 + f5rand(i+53)*4).toFixed(1);
      const rt=row%2 ? ' rt' : '';           /* odd rows travel the other way */
      out+=`<div class="f5${rt}" data-logo="${c.logo}" data-row="${row}"
          style="left:${x}px;top:${y}px;--period:${F5_PERIOD}px;--dd:${F5_LOOP_S}s;
                 --ddel:${(-row*F5_LOOP_S/F5_ROWS).toFixed(1)}s">
          <div class="f5in" style="--fdel:${del}ms;--fd:${dur}ms;--amp:${amp}deg;--axw:${axw}deg">
            <div class="f5face f5back"></div>
            <div class="f5face f5front${cls}" style="background:${f5Bg(c.bg)}">${face}
              <span class="f5use">${c.use}</span>
            </div>
          </div>
        </div>`;
    }
  }
  return `<div class="f5stage" id="f5Stage">${out}</div>`;
}

/* ---------- 1c. Cover v3 — merchant ring hands its identity to the card ----------
   Same continuous scroll as v2; only the second half differs. */
def('intro-v2','6307:9790 — v2',`
  <div class="v2root" id="v3Root">
    <div class="v2coverwrap" id="v3CoverWrap">
      ${cardFan()}<div class="coverbleed"><img id="v3Cover" src="" alt="Fan of Cloaked virtual cards"></div>
    </div>

    ${ringField()}
    <div class="v2scrim" id="v3Scrim"></div>

    <div class="v2copy" id="v3Copy">
      <div class="swap" id="v3A">
        <h1>We block your phone scams. Now, let's block your financial scams.</h1>
        <p>Mask and protect your true payment information with Cloaked virtual cards.</p>
      </div>
      <div class="swap down" id="v3B">
        <h1>A virtual card for every need</h1>
        <p>Instant virtual cards + privacy controls <span class="nobr">built with Mastercard</span></p>
      </div>
    </div>

    <div class="v2top">
      <span class="v2brand">Cloaked Pay</span>
      <button class="v2skip" data-skip="1" data-go="welcome">Skip intro</button>
    </div>

    <div class="v2cue" id="v3Cue"><button class="cuepill" data-cuejump3="1">Our solution ${I.chevD}</button></div>
    <div class="v2cta" id="v3Cta">
      <button class="btn onbrand" data-go="welcome">Protect my payment method</button>
    </div>

    <div class="v2scroll" id="v3Scroll"><div class="v2spacer"></div></div>
  </div>
`,{ notop:true, enter:'fade', onEnter(el){
  const root=el.querySelector('#v3Root');
  const sc=el.querySelector('#v3Scroll');
  const coverWrap=el.querySelector('#v3CoverWrap');
  const img=el.querySelector('#v3Cover');
  mountCover(img);

  const A=el.querySelector('#v3A'), B=el.querySelector('#v3B');
  function wrapWords(box){
    const h=box.querySelector('h1');
    const parts=h.textContent.trim().split(/\s+/)
      .map(w=>'<span class="w"><span class="wi">'+w+'</span></span>');
    /* A non-breaking space does NOT hold two words together here: each word is
       an inline-block, which UAX #14 treats as class CB, and rule LB20 allows a
       break on either side of it whatever the text between says. The last pair
       has to be wrapped in a nowrap box instead. */
    h.innerHTML = parts.length>2
      ? parts.slice(0,-2).join(' ')+' <span class="nobr">'+parts.slice(-2).join(' ')+'</span>'
      : parts.join(' ');
    h.querySelectorAll('.wi').forEach((n,i)=>{ n.style.transitionDelay=(i*55)+'ms'; });
  }
  wrapWords(A); wrapWords(B);
  requestAnimationFrame(()=>A.classList.add('on'));
  let second=null;
  const swapTo=(x)=>{
    if(x===second) return; second=x;
    A.classList.toggle('up', x);   A.classList.toggle('on', !x);
    B.classList.toggle('down', !x); B.classList.toggle('on', x);
  };

  const cue=el.querySelector('#v3Cue'), cta=el.querySelector('#v3Cta');
  const skip=el.querySelector('[data-skip]');
  let fanOut=false;
  const replayFan=()=>{
    /* .back stays on from the first return, so fanOut only ever plays on entry */
    el.querySelectorAll('.fcard').forEach(c=>{
      c.classList.add('back');
      c.style.animation='none'; void c.offsetWidth; c.style.animation='';
    });
  };
  const scrim=el.querySelector('#v3Scrim');
  const stage=el.querySelector('#r3Stage');
  const chips=[...el.querySelectorAll('.r3chip')];
  const card=el.querySelector('#r3Card');
  const faceA=el.querySelector('#r3A'), faceB=el.querySelector('#r3B');

  const num=v=>{
    const raw=getComputedStyle(stage).getPropertyValue(v).trim();
    return raw.endsWith('ms')?parseFloat(raw):parseFloat(raw);
  };
  /* ---- the ring turns slowly; a mark lights every --hold-r3 ---- */
  let rot=0, last=0, sel=-1, raf=0, timer=null, spinning=false;
  const place=()=>{
    chips.forEach((ch,i)=>{
      const a=(i/chips.length)*Math.PI*2 + rot;
      /* no jitter: it was meant to soften the dial but only made the marks look
         misaligned. Each mark's ink centre now lands exactly on the ellipse. */
      const [nx,ny]=ringNudge(R3[i]||{});
      ch.style.transform=`translate(${(R3_CX+Math.cos(a)*R3_RX+nx).toFixed(1)}px,`
        +`${(R3_CY+Math.sin(a)*R3_RY+ny).toFixed(1)}px)`;
    });
  };
  const tick=(t)=>{
    if(!stage.isConnected) return;
    const dt=last?Math.min(.05,(t-last)/1000):.016; last=t;
    rot += dt*(num('--spin-r3')||0.055);
    place();
    raf=requestAnimationFrame(tick);
  };
  /* Whichever mark is lit hands the card its identity. The change is not a
     cross-fade: a gradient rises inside the card, and that same gradient is the
     mask that reveals the next face behind it. */
  const paint=(f,c)=>{
    f.style.background=c.bg;
    f.className='r3face'+(f===faceB?' r3in':'')+(c.art?' art':'')
      +(c.ink==='dark'?' ink-dark':'')+(LOGO_KEEP.has(c.logo)?' logo-keep':'')
      +(c.logoWhite?' logo-lite':'');
    if(c.art){
      f.innerHTML = r3Media(c,'r3art')+`<span class="r3name">${ART_NAME[c.logo]||''}</span>`;
      const v=f.querySelector('video');
      if(v){ v.muted=true; v.playsInline=true;
             const pr=v.play(); if(pr&&pr.catch) pr.catch(()=>{}); }
    }else{
      f.innerHTML='<img alt="">';
      f.querySelector('img').src=CARD_ART[c.logo];
    }
  };
  paint(faceA,R3[0]); paint(faceB,R3[0]);   /* never sit unpainted while loading */
  let swapT=null;
  const light=(i,instant)=>{
    sel=i%chips.length;
    const c=R3[sel];
    chips.forEach((ch,k)=>ch.classList.toggle('on', k===sel));
    card.dataset.use=c.use;      /* "Free trail", not "Free trail card" */
    card.dataset.n=c.n;
    card.classList.toggle('ink-dark', c.ink==='dark');
    const SWAP=num('--dur-r3swap')||900;
    if(instant){
      paint(faceA,c); paint(faceB,c);
      revealCard(card, 480);
    }else{
      paint(faceB,c);                      /* the incoming face, masked */
      card.classList.remove('swap');
      void card.offsetWidth;               /* restart the rise */
      card.classList.add('swap');
      clearTimeout(swapT);
      swapT=setTimeout(()=>{               /* hand it to the base layer */
        if(!card.isConnected) return;
        paint(faceA,c);
        card.classList.remove('swap');
        /* the new mark was held back for the whole rise; bring it up now, once
           the old one is definitely gone */
        card.classList.add('markin');
        setTimeout(()=>{ if(card.isConnected) card.classList.remove('markin'); }, 300);
      }, SWAP);
      revealCard(card, SWAP);              /* digits churn for the whole rise */
    }
    place();
  };
  const startRing=()=>{
    if(spinning) return; spinning=true;
    light(0,true);
    raf=requestAnimationFrame(tick);
    timer=setInterval(()=>{ if(stage.isConnected) light(sel+1); }, num('--hold-r3')||2300);
  };
  const stopRing=()=>{
    spinning=false; cancelAnimationFrame(raf); clearInterval(timer); clearTimeout(swapT); last=0;
    card.classList.remove('swap');
    chips.forEach(ch=>ch.classList.remove('on'));
    [card.querySelector('.cc-use'), card.querySelector('.cc-num')].forEach(x=>{
      if(x._scr){ clearInterval(x._scr); x._scr=null; } x.textContent='';
    });
  };
  place();

  /* ---- the same single progress value as v2 ---- */
  /* page colour follows the Theme switch; the board end is always dark */
  const lightUI=document.body.classList.contains('lightcover');
  const LIGHT=lightUI?[244,236,233]:[20,20,16], DARK=[20,20,16];
  const INK=lightUI?[20,20,16]:[255,255,255], CREAM=[255,255,255];
  const lerp=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
  const mix=(a,b,t)=>`rgb(${lerp(a,b,t).join(',')})`;
  const cl01=v=>Math.max(0,Math.min(1,v));
  let p=0;
  function apply(){
    const dark=cl01((p-0.05)/0.45);
    root.style.background=mix(LIGHT,DARK,dark);
    root.style.color=mix(INK,CREAM,dark);
    coverWrap.style.opacity=String(1-cl01((p-0.02)/0.38));
    coverWrap.style.transform=`translateY(${(-70*cl01(p/0.5)).toFixed(1)}px)`;
    const ring=cl01((p-0.30)/0.30);
    stage.style.opacity=String(ring);
    const [r,g,b]=lerp(LIGHT,DARK,dark);
    scrim.style.background=`linear-gradient(180deg,rgba(${r},${g},${b},.97) 0%,`
      +`rgba(${r},${g},${b},.99) 40%,rgba(${r},${g},${b},.88) 60%,`
      +`rgba(${r},${g},${b},.52) 80%,rgba(${r},${g},${b},0) 100%)`;
    scrim.style.opacity=String(ring);
    cue.classList.toggle('gone', p>0.02);
    cta.classList.toggle('in', p>0.62);
    /* at the end the header offers the way back, and uses the same glide */
    if(skip){
      const atEnd = p>0.62;
      if(atEnd!==skip._end){ skip._end=atEnd; skip.textContent = atEnd?'Restart':'Skip intro'; }
    }
    /* returning to the cover replays the fan with its own per-card delays, so
       the cards step back rather than all arriving together */
    if(p<0.08){ if(fanOut){ fanOut=false; replayFan(); } } else fanOut=true;
    swapTo(p>0.30);
    /* Both of these are visible from p=0.30 but used to only run above 0.55, so a
       scroll that came to rest between the two left the artwork on screen and
       motionless — and the stop path blanks every usage and number, so the cards
       sat there painted but wordless. That is the "stuck on page two". Start as
       soon as it is meaningfully visible, and keep the start and stop thresholds
       apart: with a single threshold, jitter at the boundary starts and stops it on
       alternate scroll events, re-blanking the cards each time. The flip wall
       already worked this way. */
    if(p>0.34) startRing(); else if(spinning && p<0.28) stopRing();
  }
  const read=()=>{
    const max=sc.scrollHeight-sc.clientHeight;
    p = max>0 ? sc.scrollTop/max : 0;
    apply();
  };
  sc.addEventListener('scroll', read, {passive:true});
  el.addEventListener('click', e=>{
    if(e.target.closest('[data-cuejump3]'))
      sc.scrollTo({top:sc.scrollHeight-sc.clientHeight, behavior:'smooth'});
  });
  sc.scrollTop=0; apply();
}});

/* ---------- 1e. Cover v5 — the flip wall ---------- */
def('intro-v4','6307:9790 — v4',`
  <div class="v2root wallroot" id="v5Root">
    <div class="v2coverwrap" id="v5CoverWrap">
      ${cardFan()}<div class="coverbleed"><img id="v5Cover" src="" alt="Fan of Cloaked virtual cards"></div>
    </div>

    <div id="f5Mount"></div>
    <div class="v2scrim" id="v5Scrim"></div>

    <div class="v2copy" id="v5Copy">
      <div class="swap" id="v5A">
        <h1>We block your phone scams. Now, let's block your financial scams.</h1>
        <p>Mask and protect your true payment information with Cloaked virtual cards.</p>
      </div>
      <div class="swap down" id="v5B">
        <h1>A virtual card for every need</h1>
        <p>Instant virtual cards + privacy controls <span class="nobr">built with Mastercard</span></p>
      </div>
    </div>

    <div class="v2top">
      <span class="v2brand">Cloaked Pay</span>
      <button class="v2skip" data-skip="1" data-go="welcome">Skip intro</button>
    </div>

    <div class="v2cue" id="v5Cue"><button class="cuepill" data-cuejump5="1">Our solution ${I.chevD}</button></div>
    <div class="v2cta" id="v5Cta">
      <button class="btn onbrand" data-go="welcome">Protect my payment method</button>
    </div>

    <div class="v2scroll" id="v5Scroll"><div class="v2spacer"></div></div>
  </div>
`,{ notop:true, enter:'fade', onEnter(el){
  const root=el.querySelector('#v5Root');
  const sc=el.querySelector('#v5Scroll');
  const coverWrap=el.querySelector('#v5CoverWrap');
  const img=el.querySelector('#v5Cover');
  mountCover(img);

  const A=el.querySelector('#v5A'), B=el.querySelector('#v5B');
  function wrapWords(box){
    const h=box.querySelector('h1');
    const parts=h.textContent.trim().split(/\s+/)
      .map(w=>'<span class="w"><span class="wi">'+w+'</span></span>');
    h.innerHTML = parts.length>2
      ? parts.slice(0,-2).join(' ')+' <span class="nobr">'+parts.slice(-2).join(' ')+'</span>'
      : parts.join(' ');
    h.querySelectorAll('.wi').forEach((n,i)=>{ n.style.transitionDelay=(i*55)+'ms'; });
  }
  wrapWords(A); wrapWords(B);
  requestAnimationFrame(()=>A.classList.add('on'));
  let second=null;
  const swapTo=(x)=>{
    if(x===second) return; second=x;
    A.classList.toggle('up', x);   A.classList.toggle('on', !x);
    B.classList.toggle('down', !x); B.classList.toggle('on', x);
  };

  const cue=el.querySelector('#v5Cue'), cta=el.querySelector('#v5Cta');
  const skip=el.querySelector('[data-skip]');
  let fanOut=false;
  const replayFan=()=>{
    /* .back stays on from the first return, so fanOut only ever plays on entry */
    el.querySelectorAll('.fcard').forEach(c=>{
      c.classList.add('back');
      c.style.animation='none'; void c.offsetWidth; c.style.animation='';
    });
  };
  const scrim=el.querySelector('#v5Scrim');
  /* built here, not in the template: the turned grid has a different number of
     tiles, so it cannot be baked into a string made once at load */
  el.querySelector('#f5Mount').innerHTML=flipWall();
  const stage=el.querySelector('#f5Stage');
  const tiles=[...el.querySelectorAll('.f5in')];
  el.querySelectorAll('.f5stage video').forEach(v=>{
    v.muted=true; v.playsInline=true;
    const pr=v.play(); if(pr&&pr.catch) pr.catch(()=>{});
  });
  /* hold every tile blank until the wall is actually on screen, then let each
     one run its own delay — otherwise they all flip while still hidden */
  let flipped=false;
  tiles.forEach(t=>{ t.style.animationPlayState='paused'; });
  const runFlips=()=>{
    if(flipped) return; flipped=true;
    tiles.forEach(t=>{ t.style.animationPlayState='running'; });
  };
  const resetFlips=()=>{
    flipped=false;
    tiles.forEach(t=>{
      t.style.animation='none'; void t.offsetWidth; t.style.animation='';
      t.style.animationPlayState='paused';
    });
  };

  /* page colour follows the Theme switch; the board end is always dark */
  const lightUI=document.body.classList.contains('lightcover');
  /* The wall end is true black, not the warm #141410 the other versions land on:
     a lifted card needs a floor below it or it reads as an unloaded tile. The
     scrim lerps off the same pair, so it dissolves into the stage. */
  const LIGHT=lightUI?[244,236,233]:[20,20,16], DARK=[0,0,0];
  const INK=lightUI?[20,20,16]:[255,255,255], CREAM=[255,255,255];
  const lerp=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
  const mix=(a,b,t)=>`rgb(${lerp(a,b,t).join(',')})`;
  const cl01=v=>Math.max(0,Math.min(1,v));
  let p=0;
  function apply(){
    const dark=cl01((p-0.05)/0.45);
    root.style.background=mix(LIGHT,DARK,dark);
    root.style.color=mix(INK,CREAM,dark);
    coverWrap.style.opacity=String(1-cl01((p-0.02)/0.38));
    coverWrap.style.transform=`translateY(${(-70*cl01(p/0.5)).toFixed(1)}px)`;
    const wall=cl01((p-0.30)/0.30);
    stage.style.opacity=String(wall);
    const [r,g,b]=lerp(LIGHT,DARK,dark);
    scrim.style.background=`linear-gradient(180deg,rgba(${r},${g},${b},.97) 0%,`
      +`rgba(${r},${g},${b},.99) 40%,rgba(${r},${g},${b},.88) 60%,`
      +`rgba(${r},${g},${b},.52) 80%,rgba(${r},${g},${b},0) 100%)`;
    scrim.style.opacity=String(wall);
    cue.classList.toggle('gone', p>0.02);
    cta.classList.toggle('in', p>0.62);
    /* at the end the header offers the way back, and uses the same glide */
    if(skip){
      const atEnd = p>0.62;
      if(atEnd!==skip._end){ skip._end=atEnd; skip.textContent = atEnd?'Restart':'Skip intro'; }
    }
    /* returning to the cover replays the fan with its own per-card delays, so
       the cards step back rather than all arriving together */
    if(p<0.08){ if(fanOut){ fanOut=false; replayFan(); } } else fanOut=true;
    swapTo(p>0.30);
    /* re-arm only after the wall is fully faded (opacity hits 0 at p=0.30),
       so scrolling back never snaps visible tiles to blank */
    if(p>0.42) runFlips(); else if(flipped && p<0.10) resetFlips();
  }
  const read=()=>{
    const max=sc.scrollHeight-sc.clientHeight;
    p = max>0 ? sc.scrollTop/max : 0;
    apply();
  };
  sc.addEventListener('scroll', read, {passive:true});
  el.addEventListener('click', e=>{
    if(e.target.closest('[data-cuejump5]'))
      sc.scrollTo({top:sc.scrollHeight-sc.clientHeight, behavior:'smooth'});
  });
  sc.scrollTop=0; apply();
}});

/* ---- v4: one portrait card face, built from the same collection ---- */
const C4_W=212, C4_H=337;                     /* 212:337 = the 183:291 card upright */
/* The copy block runs to ~264px (top 132 + two 32/1.12 lines + 14 + two 16/1.45
   lines). Centre the card so its top edge clears that with room to spare —
   at the old 452 the card top was 283 and the subtitle sat on top of it. */
/* copy runs to 264; the CTA sits 32px off the bottom and is 56 tall */
const C4_COPY_BOTTOM=264, C4_CTA_TOP=852-32-56;
/* Solved at mount, not at load, because the toggle changes the card's height.
   Centred between the copy and the CTA rather than hung a fixed gap below the
   copy: the old rule was top-anchored, so the turned card — 125px shorter — rode
   up instead of holding the middle of the space. This is the rule the ring
   already used. Cover scale is driven by the larger gap above or below that
   centre, since the card has to clear the further frame edge. */
function c4Geom(){
  const {w,h}=cardBox(C4_W,C4_H);
  const cy=(C4_COPY_BOTTOM+C4_CTA_TOP)/2;
  return {w,h,cy,cover:+(2*Math.max(cy,852-cy)/h + 0.12).toFixed(3)};
}
/* v4 deck: virtual cards are for specific uses, not just merchants —
   so the photo/illustration cards (dating, Seattle trip, Maya) surface
   early (3rd) and then every third card, instead of drowning in logos. */
/* Deduped by logo first. COLLECTION has 40 slots for 33 logos — it repeats a
   few to fill the fan — and Hobbes is one of the repeats, so the raw filter gave
   an art cycle of [dating, hobbes, hobbes, seattle, mayaphoto]. Two Hobbes cards
   next to each other in the cycle put them 2 apart in a deck this size. */
const c4uniq = list => { const seen=new Set();
  return list.filter(c=>!seen.has(c.logo) && seen.add(c.logo)); };
const C4_ARTS  = c4uniq(COLLECTION.filter(c=>c.art));
const C4_LOGOS = c4uniq(COLLECTION.filter(c=>!c.art));
const C4_DECK  = (()=>{
  const d=[]; let a=0;
  for(let l=0; l<C4_LOGOS.length; ){
    d.push(C4_LOGOS[l++]);
    if(l<C4_LOGOS.length) d.push(C4_LOGOS[l++]);
    d.push(C4_ARTS[a++ % C4_ARTS.length]);   /* every 3rd card is an art card */
  }
  return d;
})();
/* art cards carry no logo — they get a written title instead, since a
   virtual card can be for a specific use rather than a merchant */
const C4_TITLES = { dating:'Dating', seattle:'Travel to Seattle', mayaphoto:'Maya', hobbes:'Hobbes' };
function c4Face(c){
  const art = c.video
    ? `<video class="c4-art" src="${DATING_BG}" muted loop playsinline autoplay
              preload="auto" disablepictureinpicture></video>`
    : c.art
    ? `<img class="c4-art" src="${CARD_ART[c.artv||c.logo]}" alt="">`
    : `<img class="c4-logo" src="${CARD_ART[c.logo]}" alt="">`;
  const title = C4_TITLES[c.logo]
    ? `<span class="c4-title">${C4_TITLES[c.logo]}</span>` : '';
  const cls = (c.ink==='dark'?' ink-dark':'') + (LOGO_KEEP.has(c.logo)?' logo-keep':'')
            + (title?' has-title':'');
  const g=c4Geom();
  return `<div class="c4card${cls}" data-use="${c.use} card" data-n="${c.n}"
      style="background:${c.bg};--cs:${g.cover};--c4cy:${g.cy}px">
      ${art}${title}
      <span class="cc-num c4-num"></span>
      <span class="cc-use c4-use"></span>
    </div>`;
}

/* ---------- 1d. Cover v4 — recursive card zoom ---------- */
def('intro-v3','6307:9790 — v3',`
  <div class="body flush introwrap v2wrap" id="v4Scroll">
    <div class="v3top">
      <span class="v3brand">Cloaked Pay</span>
      <button class="skippill" data-go="welcome">Skip intro</button>
    </div>
    <div class="mgroup">
      <div class="introhead">
        <h1 id="v4Title">We block your phone scams. Now, let's block your financial scams.</h1>
        <p class="msub">Mask and protect your true payment information with Cloaked virtual cards.</p>
      </div>
    </div>

    <div class="coverstick">
      ${cardFan()}<div class="coverbleed"><img id="v4Cover" src="" alt="Fan of Cloaked virtual cards"></div>
    </div>

    <div class="scrollpad"></div>
  </div>
  <div class="ourcards"><button class="cuepill" data-showdark4="1">Our solution ${I.chevD}</button></div>

  <section class="darksec4">
    <div class="c4stage" id="c4Stage"></div>
    <div class="c4scrim"></div>
    <div class="v3top">
      <span class="v3brand">Cloaked Pay</span>
      <button class="skippill" data-v4restart="1">Restart</button>
    </div>
    <div class="c4head">
      <h1>Virtual cards for<br>every need</h1>
      <p>From one time purchases to recurring subscriptions, powered by Mastercard.</p>
    </div>
    <div class="darkcta4">
      <button class="btn onbrand" data-go="welcome">Protect my payment method</button>
    </div>
  </section>
`,{ notop:true, enter:'fade', onEnter(el){
  const wrap=el.querySelector('#v4Scroll');
  wrap.scrollTop=0;
  const img=el.querySelector('#v4Cover');
  mountCover(img, el.querySelector('.coverstick'), (h,g) => h - g.keep);
  revealLines(el.querySelector('#v4Title'));
  requestAnimationFrame(()=>setTimeout(()=>wrap.classList.add('in'),300));

  const sec=el.querySelector('.darksec4');
  const stage=el.querySelector('#c4Stage');
  const ms=(v,fb)=>{
    const raw=getComputedStyle(stage).getPropertyValue(v).trim();
    if(!raw) return fb;
    return raw.endsWith('ms') ? parseFloat(raw) : parseFloat(raw)*1000 || fb;
  };
  let i=0, timers=[], running=false;

  /* One card's life: grow from nothing, hold while its details generate, then
     expand past the frame. The next card is spawned the moment this one starts
     expanding, so it grows inside the card that is still opening out. */
  const spawn=()=>{
    if(!stage.isConnected) return;
    const c=C4_DECK[i % C4_DECK.length]; i++;
    /* trim before adding, so the cap is hard rather than eventual */
    while(stage.children.length>2) stage.removeChild(stage.firstElementChild);
    stage.insertAdjacentHTML('beforeend', c4Face(c));
    const card=stage.lastElementChild;
    /* alternate the swing: odd cards tilt right (the stylesheet default),
       even cards mirror to the left */
    if(i % 2 === 0){
      card.style.setProperty('--tilt4-y','13deg');
      card.style.setProperty('--flip4','-10deg');   /* mirror the swing too */
    }
    const vid=card.querySelector('video');
    if(vid){ vid.muted=true; vid.playsInline=true;
             const pr=vid.play(); if(pr&&pr.catch) pr.catch(()=>{}); }
    card.classList.add('grow');
    const GROW=ms('--dur-grow',760);
    /* the first card should open out on arrival rather than sit there for two
       seconds — only the cards after it get the full dwell */
    const HOLD=(i===1) ? ms('--hold-v4-first',420) : ms('--hold-v4',2000);
    timers.push(setTimeout(()=>{ if(card.isConnected) revealCard(card, GROW); }, GROW*0.4));
    timers.push(setTimeout(()=>{
      if(!card.isConnected) return;
      card.classList.remove('grow');
      card.classList.add('expand');
      spawn();                                   /* the next one starts now */
    }, GROW+HOLD));
  };
  const start=()=>{ if(running) return; running=true; spawn(); };

  let raised=false;
  const raise=()=>{
    if(raised) return; raised=true;
    sec.classList.add('up');
    start();
  };
  const restart4=()=>{
    timers.forEach(clearTimeout); timers=[];
    stage.innerHTML=''; i=0; running=false; raised=false;
    sec.classList.remove('up');
    wrap.scrollTop=0;
  };
  armTray(wrap, raise);
  el.addEventListener('click', e=>{
    if(e.target.closest('[data-showdark4]')) raise();
    if(e.target.closest('[data-v4restart]')) restart4();
  });
}});

/* ---------- 2. Welcome wash — 6220:50882 → 50891 → 50899 ---------- */
def('welcome','6220:50882 · 50891 · 50899',`
  <div class="welcome">
    <div class="wl-gold"></div>
    <div class="wl-title linesin">
      <span class="ln"><i>Margaret,</i></span>
      <span class="ln"><i>let's create your</i></span>
      <span class="ln"><i>first virtual card</i></span>
    </div>
  </div>
`,{ light:true, enter:'fade',      /* no horizontal slide on the way in */
    autoTo:'id-intro', autoAt:'welcome',
    delay:'washdelay',             /* read time on gold before the wash */
    hold:300 + 440 + 180,          /* short settle, then the lines fly out */
    onEnter(el){
      setStatus(true);
      /* once the wash settles, send the title out line by line */
      const t = (MOTION.washdelay.dur + MOTION.welcome.dur + 300) * slowmo;
      setTimeout(()=>{
        if(!el.isConnected) return;
        const wt=el.querySelector('.wl-title');
        wt.classList.remove('linesin');   /* lineIn and lineOut both target
                                             .ln>i — the entry class has to go
                                             or it wins on source order */
        wt.classList.add('leaving');
      }, t);
    } });

/* ---------- 3. Please verify your information — 6253:60151 ----------
   The Figma art is a flattened boolean Union. Rebuilt here as separate
   stroked paths so every part can be animated independently later:
   .idc-frame .idc-head .idc-body .idc-line (×3)                        */
/* Exact geometry from Assets/image-verify.svg. The source is one flattened
   path; here it is split into its component subpaths so each element can be
   animated on its own, with the coordinates untouched. */
const idCardArt = (id='a')=>`
<svg class="idcard" viewBox="0 0 279 181" fill="none" aria-hidden="true">
  <g clip-path="url(#idcClip-${id})">
    <path class="idc-frame" d="M278 0C278.552 0 279 0.447715 279 1V180L278.995 180.103C278.944 180.607 278.518 181 278 181H1L0.897461 180.995C0.427031 180.947 0.0527824 180.573 0.00488281 180.103L0 180V1C1.087e-06 0.482324 0.393332 0.0562146 0.897461 0.00488281L1 0H278ZM20 161H259V20H20V161Z"/>
    <path class="idc-body" d="M83.5 97C96.0978 97 108.18 102.004 117.088 110.912C125.996 119.82 131 131.902 131 144.5H110.423C110.423 137.36 107.587 130.511 102.538 125.462C97.489 120.413 90.6405 117.577 83.5 117.577C76.3595 117.577 69.511 120.413 64.4619 125.462C59.4128 130.511 56.5771 137.36 56.5771 144.5H36C36 131.902 41.0041 119.82 49.9121 110.912C58.8201 102.004 70.9022 97 83.5 97Z"/>
    <path class="idc-head" d="M83 32C99.0163 32 112 44.9837 112 61C112 77.0163 99.0163 90 83 90C66.9837 90 54 77.0163 54 61C54 44.9837 66.9837 32 83 32ZM83 52C78.0294 52 74 56.0294 74 61C74 65.9706 78.0294 70 83 70C87.9706 70 92 65.9706 92 61C92 56.0294 87.9706 52 83 52Z"/>
    <path class="idc-line idc-line-1" d="M238 67H148V47H238V67Z"/>
    <path class="idc-line idc-line-2" d="M238 103H148V83H238V103Z"/>
    <path class="idc-line idc-line-3" d="M238 139H148V119H238V139Z"/>
  </g>
  <defs><clipPath id="idcClip-${id}"><rect width="279" height="181" rx="8"/></clipPath></defs>
</svg>`;

/* ---------- v2 art: the fingerprint — from 00_Exploration/verify-fingerprint.html
   Geometry from Figma 6462:11584 (head circles cy 448, shoulder dome cy
   649.25), densified ~1.6× and broken into ridge segments so the ring
   avatar reads as a print. The ridges rest grey; the brand orange then
   DRAWS along them segment by segment across five waves — the gesture of
   a Touch-ID press, not a fade. Segment order is seeded, so grey and
   orange are always the same shape.                                    */
/* domeCy 633.25, not 649.25: the shoulders sit 16px nearer the head. The gap
   between the head circles' bottom (514) and the dome's crown was 23.5px. */
const PRINT = { cx:190.5, headCy:448, domeCy:633.25, seed:20260808 };
function pRnd(a){ return function(){ a|=0; a=a+0x6D2B79F5|0;
  var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t;
  return ((t^t>>>14)>>>0)/4294967296; }; }
function printRings(){
  const out=[];
  /* Half the old spacing: the rings were 11px apart, giving 6 + 10. At 5.5 they
     read as a print rather than a diagram — 11 + 19 — which is the density v3
     arrived at for the same reason. */
  for(let r=66;r>=11;r-=5.5) out.push({cx:PRINT.cx,cy:PRINT.headCy,r,a0:0,a1:360,full:true});
  for(let r=111.5;r>=12.5;r-=5.5) out.push({cx:PRINT.cx,cy:PRINT.domeCy,r,a0:180,a1:360,full:false});
  return out;
}
function printSegsFor(ring, rnd){
  const span=ring.a1-ring.a0;
  const nGaps = ring.full ? (ring.r>48?3:ring.r>18?2:1) : (ring.r>82?3:ring.r>40?2:1);
  const rot = ring.full ? rnd()*360 : 0;
  const centers=[], chunk=span/nGaps;
  for(let i=0;i<nGaps;i++) centers.push(ring.a0+chunk*i+chunk*(0.3+0.4*rnd()));
  const gaps=centers.map(c=>{
    const px=9+6*rnd();
    const deg=Math.min(px/(Math.PI*ring.r/180), ring.full?46:36);
    return [c-deg/2, c+deg/2];
  }).sort((a,b)=>a[0]-b[0]);
  const out=[];
  if(ring.full){
    for(let g=0;g<gaps.length;g++){
      const s=gaps[g][1];
      const e=(g+1<gaps.length)?gaps[g+1][0]:gaps[0][0]+360;
      out.push({cx:ring.cx,cy:ring.cy,r:ring.r,a0:s+rot,a1:e+rot});
    }
  }else{
    let cur=ring.a0;
    gaps.forEach(gp=>{ if(gp[0]>cur+5) out.push({cx:ring.cx,cy:ring.cy,r:ring.r,a0:cur,a1:gp[0]}); cur=gp[1]; });
    if(ring.a1>cur+5) out.push({cx:ring.cx,cy:ring.cy,r:ring.r,a0:cur,a1:ring.a1});
  }
  return out;
}
function printArc(s, reverse){
  const rad=d=>d*Math.PI/180;
  const a0=reverse?s.a1:s.a0, a1=reverse?s.a0:s.a1;
  const x0=s.cx+s.r*Math.cos(rad(a0)), y0=s.cy+s.r*Math.sin(rad(a0));
  const x1=s.cx+s.r*Math.cos(rad(a1)), y1=s.cy+s.r*Math.sin(rad(a1));
  const large=Math.abs(s.a1-s.a0)>180?1:0;
  return 'M '+x0.toFixed(2)+' '+y0.toFixed(2)+' A '+s.r+' '+s.r+' 0 '+large+' '+
         (reverse?0:1)+' '+x1.toFixed(2)+' '+y1.toFixed(2);
}
let PRINT_SEGS=null;
function printSegs(){
  if(PRINT_SEGS) return PRINT_SEGS;
  const rnd=pRnd(PRINT.seed), out=[];
  printRings().forEach(ring=>{
    printSegsFor(ring,rnd).forEach(s=>{
      const mid=(s.a0+s.a1)/2*Math.PI/180;
      out.push({ d:printArc(s,false), dr:printArc(s, out.length%2===1),
                 len:Math.PI*s.r*Math.abs(s.a1-s.a0)/180,
                 mx:s.cx+s.r*Math.cos(mid),
                 my:s.cy+s.r*Math.sin(mid) });          /* mid-point */
    });
  });
  PRINT_SEGS=out; return out;
}
/* modes: still = grey only, verify = grey plus a fill that animates in,
   done = the fill already complete, for the screen after verification */
const printArt = (mode='verify')=>{
  const segs=printSegs();
  const grey=segs.map(s=>`<path d="${s.d}"/>`).join('');
  const ink = mode==='still' ? ''
    : `<g class="pr-fill">${segs.map(s=>`<path d="${s.dr}" pathLength="1"/>`).join('')}</g>`;
  return `<svg class="printart ${mode}" viewBox="74 376 234 279" fill="none" aria-hidden="true">
  <g class="pr-ridge">${grey}</g>${ink}
</svg>`;
};
/* The orange draws in as one continuous stream, bottom → top.
   It used to go in five discrete waves; once the whole fill was halved to
   ~1.9s those waves read as stutter — a burst of ridges, a gap, another
   burst. Now the delays ramp smoothly across the window and each segment
   takes long enough to overlap its neighbours, so ridges are always
   arriving. Order is by mid-point height with a little jitter: enough to
   give the fill a direction, not so much that it marches. */
function printRun(scope){
  const g=scope.querySelector('.printart .pr-fill');
  if(!g) return;
  /* .done is already at full — replaying the draw would blink it back to nothing */
  if(scope.querySelector('.printart.done')) return;
  const segs=printSegs(), paths=[...g.children];
  const BASE=200, SPREAD=2600, DUR=700, JITTER=90;   /* slower: 3500 total */
  const rnd=pRnd(11);

  /* Order used to be mid-point HEIGHT, which wipes the figure bottom to top. iOS
     does not do that — ridges light all over the print and converge. So the order
     comes from a smooth spatial field sampled at each segment's middle: continuous,
     so neighbours tend to light together and it reads as patches spreading and
     joining rather than a sweep or a speckle. Same fix v3 needed. */
  const fld=(x,y)=>{
    const u=x/190, v=y/520;
    const n = Math.sin(u*6.9+1.3)*Math.cos(v*7.7-0.6)
            + 0.60*Math.sin(u*12.7-1.9)*Math.cos(v*10.9+0.8)
            + 0.35*Math.sin((u+v)*17.3+0.4);
    return (n/1.95+1)/2;
  };
  const order=segs.map((s,i)=>({ i, k: fld(s.mx,s.my)*0.86 + rnd()*0.14 }))
                  .sort((a,b)=>a.k-b.k);

  order.forEach((o,n)=>{
    const delay=BASE + (n/Math.max(1,order.length-1))*SPREAD + (rnd()-0.5)*JITTER;
    paths[o.i].animate(
      [{strokeDashoffset:1, opacity:0},
       {strokeDashoffset:1, opacity:1, offset:0.02},
       {strokeDashoffset:0, opacity:1}],
      {duration:DUR, delay:Math.max(0,delay), fill:'forwards',
       easing:'cubic-bezier(.25,0,.25,1)'});
  });
}

/* the flow's own intro screen — it shows the still half of whichever
   variation is selected, so walking the flow and clicking a v-pill can never
   disagree about which idea is being shown */
def('id-intro','6253:60151',
  ()=>`
  ${nav(1,7,{back:true})}
  <div class="body">
    <div class="head" style="padding-top:32px">
      <h1 class="tight">Please verify your information</h1>
      <p class="sub">We are required by law to verify your information before you open a virtual card</p>
    </div>
    <div class="artpanel">${verifyArtHTML('idle')}</div>
  </div>
  <div class="foot"><button class="btn" data-go="id-name">Let's do it</button></div>`,
  /* Nothing has been verified at this point, so this is the empty state: the
     print sits there in grey, initials visible, not animating. The fill belongs
     to the verifying screen. */
  { enter:'fade', onEnter(el){ verifyArtRun(el,'idle'); } });

/* ---------- 3b. Verify identity — art variations ----------------------
   v0 = id-intro above, the ID-card art (6253:60151)
   v1 = open slot — Figma 6258:64056, art still to come
   v2 = concentric-ring avatar, Cloaked Pay—WIP 6488:11715, with the fill
        colour sweeping in left → right
   v3 = the name written into a line field, inside a card

   Ring geometry is the Figma original untouched: head circles c(197,128)
   r 18/34/50/66, shoulder arcs c(197,329) r 16…112, both on a 16px step.
   The viewBox is cropped to the drawn area (the source frame carries 64px
   of dead space under the shoulders) so the figure centres in .artpanel.
   Base + fill are the same <g> used twice; only the fill copy is masked,
   so the two can never drift apart.                                     */
/* kept, unused: the plain concentric rings v2 started as, before the print
   replaced them. Cheap to keep, and the geometry is the Figma original. */
const ringArt = (id='a', mode='verify')=>`
<svg class="ringart ${mode}" viewBox="77 54 240 283" fill="none" aria-hidden="true">
  <defs>
    <g id="ringFig-${id}">
      <circle cx="197" cy="128" r="66" vector-effect="non-scaling-stroke"/>
      <circle cx="197" cy="128" r="50" vector-effect="non-scaling-stroke"/>
      <circle cx="197" cy="128" r="34" vector-effect="non-scaling-stroke"/>
      <circle cx="197" cy="128" r="18" vector-effect="non-scaling-stroke"/>
      <path d="M 85 329 A 112 112 0 0 1 309 329" vector-effect="non-scaling-stroke"/>
      <path d="M 101 329 A 96 96 0 0 1 293 329"  vector-effect="non-scaling-stroke"/>
      <path d="M 117 329 A 80 80 0 0 1 277 329"  vector-effect="non-scaling-stroke"/>
      <path d="M 133 329 A 64 64 0 0 1 261 329"  vector-effect="non-scaling-stroke"/>
      <path d="M 149 329 A 48 48 0 0 1 245 329"  vector-effect="non-scaling-stroke"/>
      <path d="M 165 329 A 32 32 0 0 1 229 329"  vector-effect="non-scaling-stroke"/>
      <path d="M 181 329 A 16 16 0 0 1 213 329"  vector-effect="non-scaling-stroke"/>
    </g>
    <!-- opaque body with the last 70 units feathered: a hard wipe reads as a
         wiper blade, this reads as the colour arriving -->
    <linearGradient id="ringEdge-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0"    stop-color="#fff"/>
      <stop offset=".825" stop-color="#fff"/>
      <stop offset="1"    stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="ringSweep-${id}" maskUnits="userSpaceOnUse" x="77" y="54" width="240" height="283">
      <rect class="ring-wipe" x="77" y="54" width="400" height="283" fill="url(#ringEdge-${id})"/>
    </mask>
  </defs>
  <use class="ring-base" href="#ringFig-${id}"/>
  ${mode==='still' ? '' : `<use class="ring-fill" href="#ringFig-${id}" mask="url(#ringSweep-${id})"/>`}
</svg>`;

def('id-intro-v1','6462:11584 — v1 (print)',`
  ${nav(1,7,{back:true})}
  <div class="body">
    <div class="head" style="padding-top:32px">
      <h1 class="tight">Please verify your information</h1>
      <p class="sub">We are required by law to verify your information before you open a virtual card</p>
    </div>
    <div class="artpanel">${printArt('still')}</div>
  </div>
  <div class="foot"><button class="btn" data-go="id-name">Let's do it</button></div>
`,{ enter:'fade' });

/* ---------- v3 art: the name written into a line field, inside a card ----
   Ported from 00_Exploration/name-lines.html — p5 there, plain canvas here
   so the prototype keeps no CDN dependency.

   The name is never drawn as type. It is rasterised into an offscreen mask
   and blurred twice: a tight blur says how much each rule SWELLS, and the
   vertical gradient of a wide blur says how far each rule is PUSHED aside.
   The letters exist only as a disturbance in the line field.

   NL is live — the panel group that appears while v2 is on screen writes
   straight into it, and the running frame loop picks the change up.      */
/* push, softness, type size and corner are settled — they stay here as
   fixed values rather than sliders, so the tray only carries what is still
   being decided. push:0 means nothing is displaced; the name is carried by
   thickness alone. */
/* 51 rules, not 40. What makes the serif read is the PITCH, not the count: the
   old 40 over a 181px card was 4.41px, and on the taller 229px card the same 40
   would be 5.58px — the coarse sampling this file already records as breaking the
   M's hairline diagonals. 51 puts the pitch back to 4.40px. */
const NL = { name:'Margaret Frimer', lines:51, weight:1, swell:0.8,
             /* size 104, not 130, and grow 1 rather than 3: a smaller cap and
                almost no dilation give the thin cut of the initials.
                What actually sets how HEAVY the initials look here is not the font
                weight — it is `swell`, the thickness a rule takes inside a letter
                as a fraction of the 4.4px gap, and `cut`, the mask level that
                counts as inside. swell 0.8 filled 80% of the gap, which is why the
                letters read solid. 0.58 and a cut of 0.60 give a lighter face. */
             /* push 10, not 0. At rest the initials are not drawn by thickness at all — the
                rules are all one weight and simply BULGE apart where the letters are,
                because nlPush is the vertical gradient of the blurred letter. As the
                orange front passes, that displacement relaxes to zero while the
                thickness grows, so a letter trades its bulge for its weight and ends
                flush with the rest of the field. Measured: at 10px the closest two
                displaced rules still hold 3.5px of air, so none of them cross. */
             /* push 28, not 10. What makes the letterform readable is not the size
                of the displacement but the DIFFERENCE in it between neighbouring
                rules — that is what bends one line against the next. At 10 that
                difference peaked at 1.6px against a 4.4px gap, far too little to
                read as an M; at 28 it is 4.6px, a full gap's worth.
                Sharpening the field instead (a smaller `soft`) raises the
                difference faster but collapses the spacing — measured, soft 8 makes
                the rules cross outright. So the blur stays wide and the push does
                the work. Worst case spacing at 28 is 1.86px, and because the bulge
                decays as the weight grows the transition only ever opens it. */
             /* push = the bump's height in px, bumpSoft = its blur radius, which
                sets how LONG the bend is. Searched together across all 51 rules:
                soft 4 / push 6 shortens the bend from 21px to 14 while raising the
                bump, and still holds 2.14px between the closest neighbours — a 1px
                rule leaves 1.1px of white there. Sharper again (soft 3) buys only
                4px more of bend but caps the push at 5, and soft 4 / push 7 drops
                the gap to 1.76, which is where they start to look merged. */
             /* the resting page breathes: the initials thicken to idleMax and back
                over idleMs, in grey, so they are just perceptible without ever
                becoming the finished state */
             /* The resting breathe needs a FLOOR. Running 0 -> idleMax -> 0 meant the
                initials vanished completely at the bottom of every cycle and you
                could not tell where they were. It oscillates between the two now. */
             idleMin:0.30, idleMax:0.68, idleMs:5200,
             push:6, bumpSoft:4, soft:30, size:104, grow:1,
             swell2:0.58, cut:0.60, taper:1.6 };
/* `size` is the em height as a % of the frame, and New York's caps are only
   ~0.7 of the em — so 100 filled just two thirds of the field. 130 puts the
   cap height at ~86% with a little air top and bottom. */
/* The field carries initials, not the whole name: at this pitch a full name
   collapses into noise. 40 rules at swell 0.8 is what makes the serif read —
   at 26 the letterform was sampled too coarsely and the M's hairline
   diagonals came out as unconnected dashes. The swollen rules nearly touch,
   so the letter reads as a solid shape cut by fine white lines. */
const nlInitials = n => (String(n).trim().split(/\s+/).filter(Boolean)
  .map(w=>w[0]).filter((_,i,a)=>i===0||i===a.length-1).join('') || '').toUpperCase();
/* 353 = the 393 frame less 20px of padding either side. The height keeps the
   card's 1.54 proportion. Everything downstream reads these, so the canvas
   attributes below are written from them rather than repeated by hand. */
/* ink is the RESTING rule colour, and it is grey now — the same grey v1 and v3
   rest at — so all three read as a grey graph that fills orange. */
const NL_CARD = { w:353, h:229, ink:'#d6d3cd', edge:'#574702' };
/* on the verified screen the card sits on the dark wash, so it inverts:
   no white fill, light rules, and an edge that reads against the dark */
const NL_DARK = { bg:null, ink:'#f3f1ed', edge:'rgba(243,241,237,.42)' };
let nlSwell=null, nlPush=null, nlBump=null, nlMask=null, nlDirty=true, nlReveal=0;

function nlClamp(v,lo,hi){ return v<lo?lo:v>hi?hi:v; }

/* separable box blur; `passes` runs ≈ gaussian. Cost is independent of r. */
function nlBlur(src,w,h,r,passes){
  let a=Float32Array.from(src), b=new Float32Array(src.length);
  const win=r*2+1;
  for(let p=0;p<passes;p++){
    for(let y=0;y<h;y++){
      let sum=0;
      for(let x=-r;x<=r;x++) sum+=a[y*w+nlClamp(x,0,w-1)];
      for(let x=0;x<w;x++){
        b[y*w+x]=sum/win;
        sum+=a[y*w+nlClamp(x+r+1,0,w-1)]-a[y*w+nlClamp(x-r,0,w-1)];
      }
    }
    for(let x=0;x<w;x++){
      let sum=0;
      for(let y=-r;y<=r;y++) sum+=b[nlClamp(y,0,h-1)*w+x];
      for(let y=0;y<h;y++){
        a[y*w+x]=sum/win;
        sum+=b[nlClamp(y+r+1,0,h-1)*w+x]-b[nlClamp(y-r,0,h-1)*w+x];
      }
    }
  }
  return a;
}

/* Separable max filter — grows every stroke by r px. A serif's hairlines
   and its stems gain the same absolute amount, so the RATIO between them
   narrows: that is what takes the glare out of a high-contrast face like
   New York without swapping the family. */
function nlDilate(src,w,h,r){
  if(r<=0) return src;
  const a=Float32Array.from(src), b=new Float32Array(src.length);
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){
    let m=0;
    for(let k=-r;k<=r;k++){ const v=a[y*w+nlClamp(x+k,0,w-1)]; if(v>m) m=v; }
    b[y*w+x]=m;
  }
  for(let x=0;x<w;x++) for(let y=0;y<h;y++){
    let m=0;
    for(let k=-r;k<=r;k++){ const v=b[nlClamp(y+k,0,h-1)*w+x]; if(v>m) m=v; }
    a[y*w+x]=m;
  }
  return a;
}
/* The field is built at whatever size asks for it — the card for v2, a square
   for v3's circle — so the cache has to remember which size it holds. */
let nlBuiltFor=null;
/* grow is the dilation applied before the blur — it is what fattens the
   letterform, so it is per-call: v2 wants a thin cut, v3 needs more body to
   survive being sampled by curved ridges. */
function nlBuild(W,H,pct,grow){
  W=W||NL_CARD.w; H=H||NL_CARD.h; pct=pct||NL.size;
  grow=(grow===undefined)?NL_TUNE.grow:grow;
  const txt=nlInitials(NL.name);
  if(!txt){ nlSwell=nlPush=nlBump=null; nlBuiltFor=null; return; }
  nlBuiltFor=W+'x'+H+'@'+pct+'/'+grow;

  if(!nlMask || nlMask.canvas.width!==W || nlMask.canvas.height!==H){
    const mc=document.createElement('canvas');
    mc.width=W; mc.height=H;
    nlMask=mc.getContext('2d',{willReadFrequently:true});
  }
  const m=nlMask;
  m.fillStyle='#000'; m.fillRect(0,0,W,H);
  m.fillStyle='#fff'; m.textAlign='center'; m.textBaseline='alphabetic';
  try{ m.letterSpacing='0.015em'; }catch(e){}
  /* the app's serif, the same face the headlines use, at NL_TUNE.wt — which is
     400, Regular. (An older comment here claimed 500; the value never was.) */
  /* the app's own serif stack — on macOS ui-serif is New York, the face the
     headlines use. Canvas silently ignores a font string it cannot parse and
     keeps the previous one, so fall back explicitly rather than shipping the
     initials in whatever was set last. */
  const face=getComputedStyle(document.documentElement).getPropertyValue('--serif').trim()
             || '"New York",ui-serif,Georgia,serif';
  const setFont=sz=>{
    m.font=NL_TUNE.wt+' '+sz+'px '+face;
    if(m.font.indexOf(String(Math.round(sz)))<0)
      m.font=NL_TUNE.wt+' '+sz+'px "New York",ui-serif,Georgia,serif';
  };

  const boxW=W-8, boxH=H*(pct/100), SQ=0.74;   /* ~15px wider each side than the old 0.88 */
  const words=txt.split(/\s+/);
  /* cap on height first, then buy height back by condensing rather than
     shrinking — short letters cannot survive a line grid, height is what
     keeps the name readable */
  const fit=arr=>{
    const cap=boxH/(arr.length===1?1:arr.length*1.06);
    setFont(cap);
    let widest=0;
    arr.forEach(l=>{ widest=Math.max(widest,m.measureText(l).width); });
    const k=widest>0?boxW/widest:1;
    if(k>=1) return {size:cap,sx:1};
    const sx=Math.max(k,SQ);
    return {size:cap*(k/sx),sx};
  };
  let lines=[txt], f=fit(lines);
  if(words.length>1){
    const mid=Math.ceil(words.length/2);
    const two=[words.slice(0,mid).join(' '),words.slice(mid).join(' ')];
    const f2=fit(two);
    if(f2.size>f.size*1.12){ lines=two; f=f2; }
  }
  setFont(f.size);
  const lead=f.size*0.98;
  /* Centre on the ink, not on the em box. `middle` splits the em, and an
     all-caps string has nothing in the descender half, so the letters sat
     visibly high. measureText's actual bounding box is the real cap height. */
  const mt=m.measureText(lines[0]);
  const asc=mt.actualBoundingBoxAscent, desc=mt.actualBoundingBoxDescent;
  const blockH=(lines.length-1)*lead+asc+desc;
  const top=H/2-blockH/2;
  m.save(); m.translate(W/2,0); m.scale(f.sx,1);
  lines.forEach((l,i)=>m.fillText(l,0,top+asc+i*lead));
  m.restore();

  const px=m.getImageData(0,0,W,H).data;
  const cov=new Float32Array(W*H);
  for(let i=0;i<W*H;i++) cov[i]=px[i*4]/255;

  /* tight blur → swell, smoothstepped so partial edge coverage cannot
     muddy a whole band */
  const grown=nlDilate(cov,W,H,grow);
  const soft=nlBlur(grown,W,H,NL_TUNE.blur,NL_TUNE.pass);
  nlSwell=new Float32Array(soft.length);
  for(let i=0;i<soft.length;i++){
    const t=nlClamp((soft[i]-NL_TUNE.lo)/NL_TUNE.win,0,1);
    nlSwell[i]=t*t*(3-2*t);
  }
  /* wide blur → its vertical gradient is the push field */
  const wide=nlBlur(cov,W,H,Math.max(1,Math.round(NL.soft)),3);
  const grad=new Float32Array(W*H);
  let peak=1e-6;
  for(let y=0;y<H;y++){
    const ym=Math.max(0,y-1), yp=Math.min(H-1,y+1);
    for(let x=0;x<W;x++){
      const g=(wide[yp*W+x]-wide[ym*W+x])*0.5;
      grad[y*W+x]=g;
      if(Math.abs(g)>peak) peak=Math.abs(g);
    }
  }
  for(let i=0;i<grad.length;i++) grad[i]/=peak;   /* normalise → the slider stays stable */
  nlPush=grad;

  /* A BUMP, not a wave. `grad` above is a DERIVATIVE, so it pushes rules apart
     above and below a letter — which reads as one broad swell across the whole
     card however small you make it. Displacing by the blurred coverage itself
     lifts a rule only where it actually crosses a letter, so the field stays
     almost straight and the letterform is a small local rise. A tighter blur than
     NL.soft, too, so the bump follows the strokes instead of pooling. */
  const bump=nlBlur(cov,W,H,Math.max(1,Math.round(NL.bumpSoft)),3);
  let bpk=1e-6;
  for(let i=0;i<bump.length;i++) if(bump[i]>bpk) bpk=bump[i];
  for(let i=0;i<bump.length;i++) bump[i]/=bpk;
  nlBump=bump;
}

function nlSample(field,x,y,W,H){
  if(!field) return 0;
  W=W||NL_CARD.w; H=H||NL_CARD.h;
  const fx=nlClamp(x,0,W-1.001), fy=nlClamp(y,0,H-1.001);
  const x0=fx|0, y0=fy|0, tx=fx-x0, ty=fy-y0;
  const a=field[y0*W+x0],     b=field[y0*W+x0+1];
  const c=field[(y0+1)*W+x0], d=field[(y0+1)*W+x0+1];
  return (a*(1-tx)+b*tx)*(1-ty)+(c*(1-tx)+d*tx)*ty;
}
function nlSmooth(arr,passes){
  for(let p=0;p<passes;p++){
    const prev=Array.from(arr);
    for(let k=1;k<arr.length-1;k++) arr[k]=(prev[k-1]+2*prev[k]+prev[k+1])/4;
  }
}

/* The scan, ported from 00_Exploration/verified-lines.html and recoloured
   to the Cloaked brand orange: a band travels bottom → top and leaves a
   residue behind it that cools off over the rest of the cycle.

   It also carries the reveal. A rule the front has not reached yet sits at
   NL.swell0, where the swell exactly equals the base weight and the name is
   invisible; once the front passes, that rule opens up to NL.swell. So the
   name is not shown and then coloured — it is written by the scan, line by
   line, which is the whole point: the name appears *because* it verified. */
/* One motion. An earlier pass split this into two beats — shape first, then
   colour — because at the time they ran at different speeds and reading
   either was hard. Now they share a front, so they belong in one pass:
     hold     every rule exactly the same width — no name yet
     rise     one front travels bottom → top. A rule swells into the letter
              and lights up orange at the same instant the front reaches it
     cool     the orange behind the front fades back to ink; the letter
              stays where the front left it                                */
/* How the mask becomes line weight. The first pass was tuned for a bold
   sans, whose strokes are thick and even; the app's serif has hairline
   diagonals and fine serifs, and a 3px blur over two passes smeared those
   below the cut, so the M broke into crumbs. A 1px single-pass blur keeps
   thin strokes intact, and the lower cut lets them through.
     blur/pass  tight blur that decides what counts as "inside a letter"
     lo/win     window that maps blurred coverage onto 0..1
     cut/band   where a rule flips from base weight to letter weight
     grow       dilation in px before any of that. New York is a high
                contrast face — its hairlines are a fraction of its stems,
                which in a line field reads as the letter being eaten
                away. Growing every stroke by the same 3px narrows that
                ratio without touching the family
     wt         font weight — 400, New York Regular, the same weight the
                headlines use. Regular only survives here because of
                `grow`: without the dilation its hairlines fall under the
                cut and the letter comes apart                          */
/* wt 300 asks for New York Light. Worth knowing: Apple ships New York in
   Regular through Black — there is no Light cut — so on macOS this will most
   likely resolve back to Regular. It is set anyway because it costs nothing and
   is honoured if a lighter face is ever present, but the lever that actually
   controls how heavy the initials read is NL.swell and NL.cut, not the weight. */
const NL_TUNE={grow:3,blur:1,pass:1,lo:0.13,win:0.32,cut:0.44,band:0.11,wt:300};
const NL_HOLD=1000, NL_RISE=1400;
/* the pre-verification loop is a tide: no dwell at either end, just a slow
   rise and fall on a cosine, 2.5x the old pace */
const NL_TIDE=5000;
/* NL_HOLD is the beat where every rule is exactly the same width and the
   name genuinely is not there. Without it the swell crossed the visible
   threshold within ~100ms — a 1.0 → 1.4px rule already reads as thicker —
   so the "before" state never registered and the name looked present from
   the first frame. The ease is cubic rather than smoothstep for the same
   reason: it stays under that threshold for longer, then opens decisively. */
const nlEase=t=>t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const NL_SCAN = { sweep:3800, rest:2400, front:64, tail:170, residue:0.20,
                  cool:2200, fade:900,
                  ink:[20,20,16], base:[201,114,74], bright:[255,85,12] };
const NL_PERIOD = NL_SCAN.sweep + NL_SCAN.rest;
/* One scan a second, three of them — 3s of scanning. The front travels for
   `srise` and its residue clears in `scool`, and the two must sum to the pass or
   the reset is visible. A 680ms front is also simply smoother to watch than the
   340ms one: the band crosses the field at half the speed. */
NL_SCAN.pass = 1000; NL_SCAN.srise = 680; NL_SCAN.scool = 320;
/* the last pass is not a scan but a fill: one front bottom to top that leaves
   every rule solid orange behind it, and opens the swell as it goes */
/* One phase after the scan, not two. The colour front and the letters growing run
   together over `fillMs` — separating them was tried and read worse. They no
   longer fight because they are different KINDS of motion now: the colour sweeps
   bottom to top, the letters open from the middle of each stroke outwards. */
/* 3000: the front carries both the colour and the swelling, so it wants time —
   at 1900 the letters were arriving faster than the eye follows them. */
NL_SCAN.fillMs = 3000; NL_SCAN.passes = 3;
const nlS01 = t => t<=0 ? 0 : t>=1 ? 1 : t*t*(3-2*t);
const nlEIO = x => x<0.5 ? 2*x*x : 1-Math.pow(-2*x+2,2)/2;

/* One front, shared. The letters rise on it and then the colour rises on it
   again — same start, same end, same duration, same easing — so the two
   halves of the sequence read as one motion repeated rather than two
   unrelated speeds. */
const NL_FE=64;
function nlFrontY(prog){ const H=NL_CARD.h; return (H+NL_FE)-prog*(H+2*NL_FE); }
/* The FILL front starts just below the bottom rule rather than NL_FE beneath the
   card. Sharing nlFrontY meant 64 of its 357px of travel happened before it
   touched anything — over half a second of nothing after the last scan pass, which
   is the wait that felt long. It still runs NL_FE past the top so the last rule
   opens fully. */
function nlFillFrontY(prog){ const H=NL_CARD.h; return (H+6)-prog*(H+6+NL_FE); }
/* rise/cool are arguments now: the looping scan runs a 500ms pass, far faster
   than NL_RISE, and its residue has to clear inside that pass or the loop pops. */
function nlScanAt(y, tl, rise, cool, lin){
  const S=NL_SCAN, H=NL_CARD.h;
  rise=rise||NL_RISE; cool=cool||S.cool;
  /* The scanning band moves at a CONSTANT speed. It used to ride nlEase — cubic
     in and out — which on a repeating pass reads as the band hesitating at both
     ends and hurrying through the middle. A scanner does not do that. */
  const t=nlClamp(tl/rise,0,1);
  const yFront=nlFrontY(lin ? t : nlEase(t));
  const d=y-yFront;                       /* >0 = already passed, front moves up */
  let i;
  if(d < -S.front)    i=0;
  else if(d < 0)      i=1+d/S.front;      /* soft rise into the front */
  else if(d < S.tail) i=1-(1-S.residue)*nlS01(d/S.tail);
  else                i=S.residue;
  if(tl > rise){                         /* residue cools once the front is out */
    const c=1-nlS01((tl-rise)/cool);
    i=Math.min(i, Math.max(i*c,0));
    if(i <= S.residue+0.001) i*=c;
  }
  return nlClamp(i,0,1);
}
function nlHex(h){ const n=parseInt(h.slice(1),16); return [(n>>16)&255,(n>>8)&255,n&255]; }
/* lerp a css colour string towards an rgb triple */
function nlMixCss(from, to, t){
  const a=String(from).startsWith('#') ? nlHex(from)
        : String(from).match(/\d+/g).map(Number);
  return 'rgb('+a.map((v,i)=>Math.round(v+(to[i]-v)*t)).join(',')+')';
}
function nlLineColor(y, tl, dark, rise, cool){
  /* rise given = the looping scan, which runs linear */
  const S=NL_SCAN, i=nlScanAt(y, tl, rise, cool, !!rise);
  /* Lerp from the RESTING rule colour, which is grey. It used to start from
     NL_SCAN.ink — [20,20,16], all but black — so the moment the scan began every
     rule the band had not reached turned dark. The field must stay grey and only
     the band brings colour. */
  const ink = dark ? nlHex(NL_DARK.ink) : nlHex(NL_CARD.ink);
  const g = i<0.6 ? S.base : S.bright;    /* the top of the ramp leans bright */
  const mix=Math.min(1, i*1.15);
  return 'rgb('+ink.map((v,k)=>Math.round(v+(g[k]-v)*mix)).join(',')+')';
}

/* ---------- v3 art: contour lines ---------------------------------------
   A topographic map, not a fingerprint. Earlier passes built the ridges as offsets
   of a single core, which is exactly what a print is — hence it kept reading as
   one however the outline was framed. These are ISO-LINES of a smooth height
   field instead: several hills and hollows, so the lines nest around peaks, run in
   parallel bands across slopes and pinch at saddles. Two properties come free and
   are the reason for the change:
     · contours of one field can never cross, at any level;
     · their spacing follows the gradient — tight where the ground is steep, open
       where it is flat — which is the quality a single core cannot produce.
   Traced by walking perpendicular to the gradient with a Newton correction back
   onto the level, so each contour comes out as an ordered polyline. Every dash
   stores its own points, computed once, so the frame loop does no geometry. */
const V3 = { size:353, pitch:5.76, seed:20260810,
             dash:[58,213], gap:[6,14], minEnd:14, sweep:4500,
             /* thick 5.2, up from 3.75. The ceiling is the closest two contours ever
                come — measured 6.60px on this terrain — since past that the swollen
                lines merge and the letters become a blob. */
             thin:1.25, thick:5.2, step:2.75, widthRamp:0.30,
             growWin:0.34, cycle:9000, grey:[214,211,205],
             /* floored for the same reason as v2's — see the note there */
             idleMin:0.42, idleMax:0.88, idleMs:6500,
             /* textPct 66 for a bigger cap, cut 0.58 for wider strokes — lowering
                the cut counts more of the blurred letter as inside, which is what
                actually thickens a stroke rather than just the line weight. */
             cut:0.58, band:0.05, textPct:66 };
/* A plain square — no corner radius. */
const V3_SQ = { half:174, radius:0 };
function v3In(x,y){
  const c=V3.size/2, k=V3_SQ.half-V3_SQ.radius;
  const qx=Math.abs(x-c)-k, qy=Math.abs(y-c)-k;
  return Math.hypot(Math.max(qx,0),Math.max(qy,0))
       + Math.min(Math.max(qx,qy),0) - V3_SQ.radius <= 0;
}
/* A topographic map with a single centre. The summit sits in the upper left and
   the ground falls away to the lower right, so the contours are closed loops
   around that one peak and open into long sweeps as they run down the slope — one
   centre, spreading top-left to bottom-right.
   Three traps found the hard way, all handled below:
     · seeds claim a HALO of cells, or the next seed lands on the same contour and
       traces it again (34 levels once produced 4,500 dashes instead of 350);
     · a CLOSED loop is walked forward only — walking backward from the same seed
       as well traverses it twice, which put points 0.03px apart;
     · levels are chosen by QUANTILE, since evenly spaced heights bunch contours
       to 0.17px on the steep side and leave the flats bare. */
const V3_TOPO = {
  /* The summit sits just OUTSIDE the top-left corner and is tighter than before
     (sigma 0.19, was 0.30). Both together are what shows only the lower-right arcs
     of its rings: a peak inside the square draws whole small circles, which is what
     looked wrong — placing it past the corner cuts every loop, and the tighter
     sigma keeps the visible arcs small. */
  peak:[0.03,-0.04, 1.00, 0.19],  /* x, y, amplitude, sigma — the one summit */
  tiltX:0.62, tiltY:0.52,         /* the fall toward the lower right */
  /* 44 levels, not 30. Quantile spacing stops short of both extremes, which left
     the summit core and the lowest corner bare — 19px and 29px of nothing. More
     levels closes both, and the spacing has the room: the tightest pair was 6.1px
     against a 3.75px line. */
  levels:44, walk:2.2, eps:0.6 };
function v3H(x,y){
  const S=V3.size, T=V3_TOPO, p=T.peak;
  const dx=(x/S-p[0])/p[3], dy=(y/S-p[1])/p[3];
  return p[2]*Math.exp(-(dx*dx+dy*dy)) - T.tiltX*(x/S) - T.tiltY*(y/S);
}
/* one contour, walked from a seed in one direction */
function v3Trace(L, sx, sy, dir){
  const T=V3_TOPO, e=T.eps, out=[];
  let x=sx, y=sy;
  for(let i=0;i<3000;i++){
    out.push(x,y);
    const gx=(v3H(x+e,y)-v3H(x-e,y))/(2*e);
    const gy=(v3H(x,y+e)-v3H(x,y-e))/(2*e);
    const g=Math.hypot(gx,gy);
    if(g<1e-7) break;
    x+=(-gy/g)*T.walk*dir; y+=(gx/g)*T.walk*dir;
    /* Newton back onto the level — without it the walk spirals off the contour */
    for(let k=0;k<2;k++){
      const h=v3H(x,y)-L;
      const ax=(v3H(x+e,y)-v3H(x-e,y))/(2*e), ay=(v3H(x,y+e)-v3H(x,y-e))/(2*e);
      const a2=ax*ax+ay*ay;
      if(a2<1e-12) break;
      x-=h*ax/a2; y-=h*ay/a2;
    }
    const m=V3_SQ.half+14, c=V3.size/2;
    if(Math.abs(x-c)>m || Math.abs(y-c)>m) break;
    if(i>10 && Math.hypot(x-sx,y-sy)<T.walk*1.3){ out.closed=true; break; }
  }
  return out;
}
let V3_DASHES=null;
function v3Dashes(){
  if(V3_DASHES) return V3_DASHES;
  const rnd=pRnd(V3.seed), T=V3_TOPO, S=V3.size, c=S/2, out=[];
  /* Sample the levels over a region WIDER than the square. Quantile spacing
     allocates by area, and with the summit sitting outside the top-left corner
     that corner holds very little area — so it was starved of levels and came out
     bare. Reaching 46px beyond the edge picks up the higher ground just outside,
     and those levels then cross the corner as short arcs. Same at the bottom-right
     for the low ground. */
  const M=46, samples=[];
  for(let y=c-V3_SQ.half-M; y<=c+V3_SQ.half+M; y+=4)
    for(let x=c-V3_SQ.half-M; x<=c+V3_SQ.half+M; x+=4) samples.push(v3H(x,y));
  samples.sort((a,b)=>a-b);
  const levelAt=t=>samples[Math.min(samples.length-1,
                        Math.max(0, Math.round(t*(samples.length-1))))];
  const G=6, N=Math.ceil(S/G)+2;
  for(let li=1; li<=T.levels; li++){
    const L=levelAt(li/(T.levels+1));
    const taken=new Uint8Array(N*N);
    for(let gy=0; gy<N; gy++) for(let gx=0; gx<N; gx++){
      if(taken[gy*N+gx]) continue;
      const x=gx*G, y=gy*G;
      /* seeds may sit outside the square — a contour that only clips a corner has
         to be found from out there; the draw pass clips it back */
      if(Math.abs(x-c)>V3_SQ.half+M || Math.abs(y-c)>V3_SQ.half+M) continue;
      if((v3H(x,y)-L)*(v3H(x+G,y+G)-L) > 0) continue;
      let px=x, py=y;
      for(let k=0;k<6;k++){
        const h=v3H(px,py)-L, e=T.eps;
        const ax=(v3H(px+e,py)-v3H(px-e,py))/(2*e), ay=(v3H(px,py+e)-v3H(px,py-e))/(2*e);
        const a2=ax*ax+ay*ay; if(a2<1e-12) break;
        px-=h*ax/a2; py-=h*ay/a2;
      }
      const fwd=v3Trace(L,px,py,1);
      let line;
      if(fwd.closed){
        line=fwd.slice();
      }else{
        const back=v3Trace(L,px,py,-1);
        line=[];
        for(let k=back.length-2;k>=0;k-=2) line.push(back[k],back[k+1]);
        for(let k=2;k<fwd.length;k+=2)     line.push(fwd[k],fwd[k+1]);
      }
      if(line.length<12) continue;
      for(let k=0;k<line.length;k+=2){
        const cx=Math.round(line[k]/G), cy=Math.round(line[k+1]/G);
        for(let oy=-1;oy<=1;oy++) for(let ox=-1;ox<=1;ox++){
          const tx=cx+ox, ty=cy+oy;
          if(tx>=0&&tx<N&&ty>=0&&ty<N) taken[ty*N+tx]=1;
        }
      }
      let acc=0, want=V3.dash[0]+rnd()*(V3.dash[1]-V3.dash[0]);
      let pts=[line[0],line[1]], gapping=false;
      for(let k=2;k<line.length;k+=2){
        acc+=Math.hypot(line[k]-line[k-2], line[k+1]-line[k-1]);
        if(!gapping) pts.push(line[k],line[k+1]);
        if(acc>=want){
          if(!gapping){
            if(pts.length>=6) out.push({pts:pts, ord:0});
            pts=[]; gapping=true; want=V3.gap[0]+rnd()*(V3.gap[1]-V3.gap[0]);
          }else{
            gapping=false; pts=[line[k],line[k+1]];
            want=V3.dash[0]+rnd()*(V3.dash[1]-V3.dash[0]);
          }
          acc=0;
        }
      }
      if(!gapping && pts.length>=6) out.push({pts:pts, ord:0});
    }
  }
  /* Fill order from a smooth spatial field, so the orange lights all over and
     converges rather than sweeping from an edge. */
  out.forEach(d=>{
    const q=(d.pts.length>>2)<<1;
    d.ord = v3Field(d.pts[q], d.pts[q+1])*0.9 + rnd()*0.10;
  });
  const olo=Math.min(...out.map(d=>d.ord)), ohi=Math.max(...out.map(d=>d.ord));
  const span=(ohi-olo)||1;
  out.forEach(d=>{ d.ord=(d.ord-olo)/span; });
  V3_DASHES=out;
  return out;
}
/* Segments are bucketed by quantised width and stroked once per bucket: one
   stroke() per segment is ~7,000 path submissions a frame, which stutters. */
const V3_KB=10;

/* A cheap smooth field — three sinusoids at incommensurate frequencies. Continuous,
   unlike a hash, which is what makes the fill cluster instead of speckle. */
function v3Field(x,y){
  const u=x/V3.size, v=y/V3.size;
  const n = Math.sin(u*7.3+1.7)*Math.cos(v*6.1-0.4)
          + 0.60*Math.sin(u*13.9-2.2)*Math.cos(v*11.3+1.1)
          + 0.35*Math.sin((u+v)*19.7+0.5);
  return nlClamp((n/1.95+1)/2, 0, 1);
}
/* 0 outside the letter, 1 well inside it */
function v3K(inside){ const k=nlClamp((inside-V3.cut)/V3.band,0,1);
  return k*k*(3-2*k); }
function v3Run(el, mode, dark){
  const cv=el.querySelector('.printlines');
  if(!cv) return;
  const S=V3.size;
  const dpr=Math.min(window.devicePixelRatio||1,2);
  cv.width=S*dpr; cv.height=S*dpr;
  const ctx=cv.getContext('2d');
  if(!ctx) return;
  const dashes=v3Dashes();
  const t0=performance.now();
  const grey = dark ? [90,88,84] : V3.grey;
  const hot  = dark ? nlHex(NL_DARK.ink) : NL_SCAN.bright;
  ctx.lineCap='round'; ctx.lineJoin='round';
  const bucket=[]; for(let i=0;i<2*V3_KB;i++) bucket.push([]);
  (function frame(now){
    if(!el.isConnected) return;
    if(nlDirty || nlBuiltFor!==S+'x'+S+'@'+V3.textPct+'/'+NL_TUNE.grow){
      nlBuild(S,S,V3.textPct,NL_TUNE.grow); nlDirty=false; }
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,S,S);
    const raw=now-t0;
    const md=el.dataset.vfmode||mode;
    let prog;
    if(md==='idle' || md==='done'){ prog=1; }
    else if(md==='loop'){
      const u=(raw%V3.cycle)/V3.cycle;
      if(u<0.50)      prog=nlS01(u/0.50);
      else if(u<0.75) prog=1;
      else            prog=1-nlS01((u-0.75)/0.25);
    }else{
      prog=nlS01(nlClamp(raw/V3.sweep,0,1));
    }
    const reach=prog*(1+V3.growWin);
    const filled = md==='idle' ? grey : hot;
    const idleT = md==='idle'
      ? V3.idleMin + (V3.idleMax-V3.idleMin)
        *(0.5-0.5*Math.cos(2*Math.PI*(raw%V3.idleMs)/V3.idleMs))
      : 1;
    for(let i=0;i<bucket.length;i++) bucket[i].length=0;
    for(let i=0;i<dashes.length;i++){
      const dh=dashes[i], pts=dh.pts, np=pts.length>>1;
      const fill=nlClamp((reach-dh.ord)/V3.growWin, 0, 1);
      /* mask level per segment, then taper every stretch that crosses a letter */
      const kk=[];
      for(let n=1;n<np;n++){
        const mx=(pts[2*n-2]+pts[2*n])/2, my=(pts[2*n-1]+pts[2*n+1])/2;
        kk.push(v3In(mx,my) ? v3K(nlSample(nlSwell,mx,my,S,S)) : -1);
      }
      for(let a2=0;a2<kk.length;){
        if(kk[a2]<=0.02){ a2++; continue; }
        let b2=a2; while(b2+1<kk.length && kk[b2+1]>0.02) b2++;
        const n2=b2-a2+1;
        for(let m=a2;m<=b2;m++){
          const u=(m-a2+0.5)/n2;
          kk[m]*=Math.sin(Math.PI*u);          /* thin at both ends of a stroke */
        }
        a2=b2+1;
      }
      for(let n=1;n<np;n++){
        const k=kk[n-1];
        if(k<0) continue;                       /* outside the square */
        const past=fill-(n/np);
        const on=past>=0 ? 1 : 0;
        const wf = on ? nlS01(nlClamp(past/V3.widthRamp,0,1)) : 0;
        const ki = on ? Math.min(V3_KB-1, (k*wf*idleT*V3_KB)|0) : 0;
        bucket[on*V3_KB+ki].push(pts[2*n-2],pts[2*n-1],pts[2*n],pts[2*n+1]);
      }
    }
    for(let on=0;on<2;on++){
      const cs='rgb('+(on?filled:grey).join(',')+')';
      for(let ki=0;ki<V3_KB;ki++){
        const b=bucket[on*V3_KB+ki];
        if(!b.length) continue;
        const k=(ki+0.5)/V3_KB;
        ctx.lineWidth = on ? V3.thin+(V3.thick-V3.thin)*k : V3.thin;
        ctx.strokeStyle=cs;
        ctx.beginPath();
        for(let n=0;n<b.length;n+=4){ ctx.moveTo(b[n],b[n+1]); ctx.lineTo(b[n+2],b[n+3]); }
        ctx.stroke();
      }
    }
    requestAnimationFrame(frame);
  })(performance.now());
}

const NL_STEP=3;                                   /* x sampling step */
function nlRun(el, mode, dark){
  const cv=el.querySelector('.linecard');
  if(!cv) return;
  const W=NL_CARD.w, H=NL_CARD.h;
  const dpr=Math.min(window.devicePixelRatio||1,2);
  cv.width=W*dpr; cv.height=H*dpr;
  const ctx=cv.getContext('2d');
  if(!ctx) return;                     /* no 2d backend — nothing to draw into */
  const t0=performance.now();
  let reveal=0;
  (function frame(now){
    if(!el.isConnected) return;                    /* screen left — stop */
    if(nlDirty || nlBuiltFor!==W+'x'+H+'@'+NL.size+'/'+NL.grow){
      nlBuild(W,H,NL.size,NL.grow); nlDirty=false; }
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,W,H);


    const t=now*0.001;
    reveal=Math.min(1,reveal+0.035);
    const ease=1-Math.pow(1-reveal,3);
    /* the breathe only rides the displacement. It used to ride the weights
       too, which made every rule a slightly different thickness every frame
       — the exact noise the uniform weight is meant to remove. */
    const amp=ease*(0.88+0.12*Math.sin(t*1.15));

    const gap=H/(NL.lines+1);
    const raw=now-t0;
    /* how far the initials have swelled in — one value for the whole field,
       so the shape arrives as a shape rather than line by line */
    let open;
    const md=el.dataset.vfmode||mode;    /* live, see the note in v3Run */
    /* how far into the fill — the screen stamps the time when it switches */
    const phase=nlClamp((now-(+(el.dataset.vffrom||0)))/NL_SCAN.fillMs, 0, 1);
    /* the resting breathe — grey throughout, so `open` and the colour stay put */
    const idleT = md==='idle'
      ? NL.idleMin + (NL.idleMax-NL.idleMin)
        *(0.5-0.5*Math.cos(2*Math.PI*(raw%NL.idleMs)/NL.idleMs))
      : 0;
    if(md==='done' || md==='idle') open=1;
    else if(md==='fill') open=1;
    else if(md==='loop'){
      /* pre-verification: a tide. The old version stepped through in / hold /
         out / hold, and the holds made it read as a blink; a cosine has no
         corners, so the name washes in and back out. */
      open=0.5-0.5*Math.cos(2*Math.PI*(raw%NL_TIDE)/NL_TIDE);
    } else open=0;      /* verifying: the field stays even — see the note below */
    /* the colour only starts once the shape is fully out */
    /* one pass, not two: the colour rides the same front that opens the
       swell, so a rule lights up at the instant it thickens */
    /* While verifying, the orange is a band SCANNING a plain grey field, looping.
       The initials are not in it at all — open is 0, so every rule is the base
       weight — and they only arrive when the screen flips to `done`, where the
       last pass fills every rule and the swell opens. One pass is the front's
       travel plus the time its residue needs to cool, or the reset would pop. */
    const scanT=raw;      /* the scan starts on the first frame, not after a hold */
    const tl = md==='verify' && scanT>0 ? scanT % NL_SCAN.pass : 0;
    /* the swell opens bottom → top rather than everywhere at once: a soft
       front travels up the field and each rule opens as it passes, so the
       initials rise into place and the colour that follows repeats the
       same direction */
    const frontY=nlFrontY(open);
    /* `grow` thickens UNIFORMLY. Every other phase moves a front up the field, and
       the initials inherited that — so they rose bottom to top instead of simply
       swelling. Here one value drives every rule, so the whole word goes from thin
       to thick together, starting the moment the field is fully orange. */
    /* How far the letters have grown, 0 to 1. One value for the whole field: the
       word swells as a whole rather than riding a front up the page. */
    /* ONE front, bottom to top. Where it has passed, the rule is orange AND its
       letter stretches have grown — colour and weight are the same event, not two
       phases. Splitting them was tried twice and read wrong both times. */
    /* idle is the resting state, so its front has NOT passed: the letters show as
       a bulge in an even-weight field, which is the whole point of the default. */
    const fProg = md==='done' ? 1
                : md==='idle' ? 0
                : md==='fill' ? nlS01(phase)
                : md==='loop' ? open
                : 0;
    const fY = md==='fill' ? nlFillFrontY(fProg) : nlFrontY(fProg);
    const wFull=gap*NL.swell2;                 /* the fully swollen rule */
    for(let i=1;i<=NL.lines;i++){
      const yBase=i*gap, ys=[], ws=[], ks=[];
      /* how far this rule is behind the front — 0 not yet reached, 1 fully passed */
      const oF=nlClamp((yBase-fY)/NL_FE, 0, 1);
      /* Idle decouples the two. Everywhere else the bump pays for the weight, but
         on the resting page the curvature has to STAY while the letters breathe —
         so the bump is held at full and only the thickness pulses, to idleMax and
         back, never reaching the finished state. */
      const gRun = md==='idle' ? idleT : oF;
      const dz   = md==='idle' ? 1 : 1-oF*oF*(3-2*oF);
      for(let x=0;x<=W;x+=NL_STEP){
        const inside=nlSample(nlSwell,x,yBase);
        /* rules INSIDE a letter stay flat — only the surrounding field is
           shoved aside, otherwise the letterforms smear */
        /* No inside-suppression any more. It existed because displacement and
           thickness used to be live together and the letterforms smeared; now dz
           is already 0 by the time a rule is thick, so they never overlap. */
        const p=nlSample(nlBump,x,yBase)*amp*dz;
        ys.push(yBase-p*NL.push);
        ks.push(nlClamp((inside-NL.cut)/NL_TUNE.band,0,1));
      }
      /* Each contiguous stretch that crosses a letter grows from its own CENTRE
         outwards, and lands tapered — thin at both ends, thick through the middle.
         Scaling the whole stretch by one number instead gave a slab with blunt
         ends that simply got fatter, which is not how a stroke is drawn. */
      for(let a2=0;a2<ks.length;){
        if(ks[a2]<=0.02){ ws.push(NL.weight); a2++; continue; }
        let b2=a2; while(b2+1<ks.length && ks[b2+1]>0.02) b2++;
        const n2=b2-a2+1;
        for(let m=a2;m<=b2;m++){
          const u=(m-a2+0.5)/n2;
          const fromMid=Math.abs(u-0.5)*2;                  /* 0 centre, 1 ends */
          const grown=nlClamp((gRun-fromMid)/0.30, 0, 1);    /* opens outwards */
          /* Exponent above 1, not below. sin^0.55 shoots up within a few samples
             of each end and then sits flat — thin only at the very tips, thick
             everywhere else. sin^1.6 builds the whole way in, which is the long
             even swell of a drawn stroke. */
          const taper=Math.pow(Math.sin(Math.PI*u), NL.taper);
          ws.push(NL.weight+(wFull-NL.weight)*taper*grown*ks[m]);
        }
        a2=b2+1;
      }
      nlSmooth(ys,3);
      const poly=(from,to)=>{
        ctx.beginPath();
        ctx.moveTo(from*NL_STEP, ys[from]-ws[from]/2);
        for(let k=from+1;k<=to;k++) ctx.lineTo(k*NL_STEP, ys[k]-ws[k]/2);
        for(let k=to;k>=from;k--)   ctx.lineTo(k*NL_STEP, ys[k]+ws[k]/2);
        ctx.closePath(); ctx.fill();
      };
      /* done  = settled, every rule orange.
         fill  = the last pass: one front bottom to top, solid orange behind it.
                 It rides the SAME front `o` that opens the swell, so a rule turns
                 orange on the frame it thickens — no second clock.
         verify= the fast looping scan across the resting grey. */
      const HOT='rgb('+NL_SCAN.bright.join(',')+')';
      const REST=(dark?NL_DARK.ink:NL_CARD.ink);
      /* fill  = one front bottom to top, grey behind it turning orange, no swell.
         grow  = already orange everywhere; this phase only thickens.
         verify= the linear looping scan across the resting grey. */
      /* The rule takes its colour from the very same front that grew it:
           verify = the linear scanning band across the resting grey
           fill   = grey below the front, orange above it, thickening as it passes
           done   = orange throughout */
      ctx.fillStyle = md==='done' ? HOT
        : (md==='verify' && scanT>0)
            ? nlLineColor(yBase, tl, dark, NL_SCAN.srise, NL_SCAN.scool)
            : nlMixCss(REST, NL_SCAN.bright, oF*oF*(3-2*oF));
      poly(0, ys.length-1);
    }
    requestAnimationFrame(frame);
  })(performance.now());
}

def('id-intro-v2','name lines — v2',`
  ${nav(1,7,{back:true})}
  <div class="body">
    <div class="head" style="padding-top:32px">
      <h1 class="tight">Please verify your information</h1>
      <p class="sub">We are required by law to verify your information before you open a virtual card</p>
    </div>
    <div class="artpanel"><canvas class="linecard" width="${NL_CARD.w}" height="${NL_CARD.h}"></canvas></div>
  </div>
  <div class="foot"><button class="btn" data-go="id-name">Let's do it</button></div>
`,{ enter:'fade', onEnter(el){ nlRun(el,'loop'); } });

def('id-intro-v3','print in rules — v3',`
  ${nav(1,7,{back:true})}
  <div class="body">
    <div class="head" style="padding-top:32px">
      <h1 class="tight">Please verify your information</h1>
      <p class="sub">We are required by law to verify your information before you open a virtual card</p>
    </div>
    <div class="artpanel"><canvas class="printlines" width="${V3.size}" height="${V3.size}"></canvas></div>
  </div>
  <div class="foot"><button class="btn" data-go="id-name">Let's do it</button></div>
`,{ enter:'fade', onEnter(el){ v3Run(el,'loop'); } });

/* ---------- 4. Full name — 6006:2143 ---------- */
def('id-name','6006:2143',`
  ${nav(1,7)}
  <div class="body">
    <div class="head"><h1>Your full name</h1>
      <p class="sub">We've auto-populated details from your encrypted profile</p></div>
    <div class="fields">
      <input class="field" value="Margaret" aria-label="First name">
      <input class="field" value="Frimer" aria-label="Last name">
    </div>
  </div>
  <div class="foot">
    <p class="footnote">Your information is always<br>encrypted and secure</p>
    <button class="btn" data-go="id-dob">Continue</button>
  </div>
`);

/* ---------- 5. Date of birth — 6012:2360 ---------- */
def('id-dob','6012:2360',`
  ${nav(1,7)}
  <div class="body">
    <div class="head"><h1>Your date of birth</h1>
      <p class="sub">We've auto-populated details from your encrypted profile</p></div>
    <div class="fields"><div class="field-wrap">
      <input class="field withicon" value="11/24/2002">
      <span class="field-icon">${I.cal}</span>
    </div></div>
  </div>
  <div class="foot"><button class="btn" data-go="id-address">Continue</button></div>
`);

/* ---------- 6. Residential address — 6016:3137 · 6019:3230 ---------- */
def('id-address','6016:3137 · 6019:3230',`
  ${nav(1,7)}
  <div class="body">
    <div class="head"><h1>Residential address</h1>
      <p class="sub">We've auto-populated details from your encrypted profile</p></div>
    <div class="fields" style="gap:24px">
      <div class="fieldgroup"><label>Address</label><input class="field" value="12 Whatney"></div>
      <div class="fieldgroup"><label>Apt suit (Optional)</label><input class="field" placeholder="Apt 001"></div>
      <div class="fieldrow">
        <div class="fieldgroup"><label>State</label>
          <div class="field select">Washington ${I.chevD.replace('<svg','<svg class="caret"')}</div></div>
        <div class="fieldgroup"><label>Zip code</label><input class="field" value="98032"></div>
      </div>
    </div>
  </div>
  <div class="foot"><button class="btn" data-go="id-phone">Continue</button></div>
`);

/* ---------- 6b. Personal mobile number ---------- */
def('id-phone','new — after address',`
  ${nav(1,7)}
  <div class="body">
    <div class="head"><h1 class="tight">What's your personal mobile number</h1>
      <span class="link muted" data-sheet="whyphone">Why do you need my phone number?</span></div>
    <div class="fields">
      <div class="fieldgroup">
        <label class="caps">Phone number</label>
        <div class="field phonefield">
          <span class="flag">&#127482;&#127480;</span><span class="cc">+1</span>
          <span>245-136-6234</span>
        </div>
        <p class="hint" style="margin-top:10px">Make sure this number is associated with the device</p>
      </div>
    </div>
  </div>
  <div class="foot"><button class="btn" data-go="id-ssn">Continue</button></div>
`);

/* ---------- 7. SSN — 6019:3282 ---------- */
def('id-ssn','6019:3282',`
  ${nav(1,7)}
  <div class="body" style="flex:0 0 auto;overflow:visible">
    <div class="head"><h1 class="tight">Social Security Number</h1>
      <p class="sub">Our bank partner requires your SSN to verify your identity, as mandated by law. We'll never store or share it.</p></div>
    <div class="fields"><div class="field-wrap">
      <div class="field withicon ssnfield">
        <span class="ssntext"></span><span class="typecaret"></span>
        <span class="ssnph">*** *** ****</span>
        <input class="nameghost" id="ssn" data-raw="" value="" readonly tabindex="-1">
      </div>
      <span class="field-icon" data-act="ssn">${I.eye}</span>
    </div></div>
  </div>
  <div style="flex:1"></div>
  <div class="foot">
    <span class="footlink">I don't have an SSN</span>
    <button class="btn" data-go="id-review" data-needs="ssn">Continue</button>
  </div>
  ${numKeyboard()}
`,{ typeTarget:'#ssn', maxLen:9, fillAll:'425352634',
    fmt:d=>d.slice(0,3)+(d.length>3?'-'+d.slice(3,5):'')+(d.length>5?'-'+d.slice(5,9):''),
    onType(el){ renderSSN(el); },
    onEnter(el){ renderSSN(el); } });

/* ---------- 8. Review profile — 6020:5841 ---------- */
def('id-review','6020:5841',`
  ${nav(2,7)}
  <div class="body flexcol">
    <div class="head"><h1>Review your profile</h1></div>
    <div class="rows bottom stagger">
      <div class="row"><span>Name</span><span class="v">Margaret Frimer</span></div>
      <div class="row"><span>Date of birth</span><span class="v">11/24/2002</span></div>
      <div class="row"><span>Address</span><span class="v">12 Whatney,<br>Irvine, CA 92618</span></div>
      <div class="row"><span>Phone number</span><span class="v">245-136-6234</span></div>
      <div class="row"><span>Email</span><span class="v">John@gont.com</span></div>
      <div class="row"><span>SSN</span><span class="v">425-235-2634</span></div>
    </div>
  </div>
  <div class="foot" style="padding-top:20px"><div class="btnrow">
    <button class="btn secondary narrow" data-go="id-name">Edit</button>
    <button class="btn" data-go="id-agreement">Continue</button>
  </div></div>
`);

/* ---------- 9. Agreement — 6020:6047 · 6094:5317 ---------- */
const ratesBody=`
  <div class="fee-head">Membership fee</div>
  <div class="fee-row"><span>Annual Fee</span><span>None</span></div>
  <div class="fee-row"><span>Participation fee</span><span>None</span></div>
  <div class="fee-gap"></div>
  <div class="fee-head">Penalty Fees</div>
  <div class="fee-row"><span>Late Payment Fee</span><span>None</span></div>
  <div class="fee-row"><span>Returned Payment Fee</span><span>None</span></div>
  <div class="fee-gap"></div>
  <div class="fee-row strong"><span>Foreign Transaction Fee</span><span>None</span></div>
  <p class="legal">Billing Rights: Information on your rights to dispute transactions and how to exercise those rights is provided in your account agreement.</p>
  <p class="legal">Cloaked Pay availability is included in your subscription to Cloaked, which includes all Cloaked core and Cloaked Pay products and services.</p>`;
const pb=t=>`<p class="legal" style="font-size:13px;line-height:1.5">${t}</p>`;
/* ---- generic title reveal ----------------------------------------
   Wraps each *visual* line of a title in its own mask and rises them in.
   Lines are found by measuring word offsetTop, so it adapts to whatever
   the text actually wraps to — no hand-authored line breaks needed.   */
function delLine(){
  const v=getComputedStyle(document.documentElement).getPropertyValue('--del-line');
  return parseFloat(v)||90;
}
function revealLines(h,offset){
  offset=offset||0;
  if(!h || h.querySelector('.ln')) return 0;

  /* 1. wrap every word so each can be measured */
  const holder=document.createElement('div');
  holder.innerHTML=h.innerHTML;
  (function walk(n){
    [...n.childNodes].forEach(c=>{
      if(c.nodeType===3){
        const frag=document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(t=>{
          if(!t) return;
          if(/^\s+$/.test(t)){ frag.appendChild(document.createTextNode(t)); return; }
          const w=document.createElement('span'); w.className='w'; w.textContent=t;
          frag.appendChild(w);
        });
        c.replaceWith(frag);
      } else if(c.nodeType===1 && c.tagName!=='BR') walk(c);
    });
  })(holder);
  h.innerHTML=holder.innerHTML;

  /* 2. group words into lines by their vertical offset */
  const ws=[...h.querySelectorAll('.w')];
  if(!ws.length) return 0;
  const lines=[]; let cur=null, last=null;
  ws.forEach(w=>{
    const top=w.offsetTop;
    if(last===null || Math.abs(top-last)>2){ cur=[]; lines.push(cur); last=top; }
    cur.push(w.textContent);
  });

  /* 3. rebuild as masked lines and stagger them in */
  h.innerHTML=lines.map(l=>`<span class="ln"><i>${l.join(' ')}</i></span>`).join('');
  h.classList.add('linesin');
  const step=delLine();
  h.querySelectorAll('.ln>i').forEach((i,idx)=>{
    i.style.animationDelay=((offset+idx)*step)+'ms';
  });
  return lines.length;
}
/* title first, then the description picks up the same stagger */
function revealHead(el){
  el.querySelectorAll('.head').forEach(head=>{
    const n = revealLines(head.querySelector('h1'));
    revealLines(head.querySelector('.sub'), n);
  });
}

/* animate the panel between 0 and its measured height */
function accSet(a,open){
  const body=a.querySelector('.acc2-body');
  a.classList.toggle('open',open);
  if(open){
    body.style.height='auto';
    const h=body.scrollHeight;
    body.style.height='0px';
    void body.offsetHeight;              /* force reflow so the transition runs */
    body.style.height=h+'px';
  }else{
    body.style.height=body.scrollHeight+'px';
    void body.offsetHeight;
    body.style.height='0px';
  }
}
function acc(title,body){
  return `<div class="acc2">
    <button class="acc2-sum">${title} ${I.chevD}</button>
    <div class="acc2-body"><div class="acc2-inner">${body}</div></div>
  </div>`;
}

def('id-agreement','6020:6047 · 6094:5317',`
  ${nav(2,7)}
  <div class="body">
    <div class="head" style="padding-bottom:40px"><h1 class="tight">Review the agreement</h1>
      <p class="sub">By submitting your application, you agree to the terms below</p></div>
    <div class="accgroup">
      ${acc('Rates &amp; Fees', ratesBody)}
      ${acc('Terms of Service', pb('These Terms of Service govern your use of Cloaked Pay virtual cards, issued by our bank partner.'))}
      ${acc('Privacy Policy', pb('We collect only what is required to issue and service your virtual cards. Personal data is encrypted at rest and never sold.'))}
      ${acc('Charge Card Agreement', pb('Balances are settled in full from your linked funding source. No revolving balance is offered and no interest is charged.'))}
      ${acc('E-Sign', pb('You consent to receive all disclosures electronically. You may withdraw consent at any time from Settings.'))}
    </div>
    <div style="height:130px"></div>   <!-- so the list clears the CTA -->
  </div>
  <div class="foot"><button class="btn" data-go="id-verifying">Submit verification</button></div>
`,{ onEnter(el){
  setTimeout(()=>{
    const a=el.querySelector('.acc2');
    if(a && el.isConnected) accSet(a,true);
  }, 1000);
}});

/* ---------- 10. Verifying — 6168:7982 ---------- */
/* The pulsing dot is gone. The wait is the print filling: grey graph on arrival,
   brand orange running through it, and it hands over to the verified screen as
   the fill lands. A function body, not a string — the art depends on which
   variation is selected, so it has to be built at render time.
   autoMs tracks the fill: NL_HOLD before it starts plus V3.sweep to run, and a
   short beat on the finished state before the screen changes. */
/* Verifying and verified are ONE screen. They used to be two, and handing over
   re-mounted the art into a different layout — the print jumped position and the
   fill restarted from zero. Now the graph filling to 100% IS the verification:
   nothing navigates, the copy changes around an art element that is never
   touched.
   Everything belonging only to the verified state is in the markup from the
   start, held at visibility:hidden. That is the point — revealing it later must
   not reflow, and .artpanel sits in normal flow below the head, so a subtitle
   appearing would otherwise shove the print down.
   The h1 has a FIXED height of two lines rather than an explicit line break:
   revealHead() re-flows every title into measured .ln lines on entry, so a <br>
   of mine is not respected. A fixed box means whatever either title wraps to, the
   head's height — and therefore the print's position — cannot change. */
def('id-verifying','6168:7982',
  ()=>`
  ${nav(3,7,{noback:true})}
  <div class="body">
    <div class="head center" style="padding-top:32px">
      <h1 id="vfTitle" class="vftitle">Verifying your details...</h1>
      <p class="sub center vfhold">Next, you can link a bank account as your funding source to create your first card.</p>
    </div>
    <div class="artpanel">${verifyArtHTML('verify')}</div>
  </div>
  <div class="foot"><button class="btn vfhold" data-go="fund-source">Set up my first card</button></div>`,
  { onEnter(el){
      verifyArtRun(el,'verify');
      const t=el.querySelector('#vfTitle');
      /* the fill lands, then the copy turns over — the art just keeps holding
         its finished state, which is what removes the jump */
      /* v2 scans, then runs a final upward fill; v1 and v3 fill throughout, so for
         them these two moments are the same and nothing extra happens. */
      const scanEnd=verifyScanMs();
      if(scanEnd < verifyArtMs()){
        setTimeout(()=>{
          if(!el.isConnected) return;
          el.dataset.vffrom=String(performance.now());
          el.dataset.vfmode='fill';
        }, scanEnd);
      }
      setTimeout(()=>{
        if(!el.isConnected) return;
        /* pin every art to its finished state on this frame. v1 and v3 have
           already arrived there on their own; v2's last fill lands it here. */
        el.dataset.vfmode='done';
        const pr=el.querySelector('.printart');
        if(pr) pr.classList.add('done');
        el.querySelectorAll('.vfhold').forEach(n=>n.classList.add('vfin'));
        t.classList.add('vfout');
        setTimeout(()=>{
          if(!el.isConnected) return;
          t.textContent='Your information was verified';
          t.classList.remove('vfout');
        }, 260);
      }, verifyArtMs());
    } });

/* ---------- 11. Verified — 6170:27563 ---------- */
def('id-verified','6170:27563',`
  ${nav(3,7,{noback:true})}<div class="state"><div class="disc">${I.check}</div></div><p class="statelabel">Verified</p>
`,{ autoTo:'id-verified-msg', autoMs:1500 });

/* ---------- 12. Information verified — 6096:6242 ---------- */
/* redesigned: the whole page washes from white to gold, bottom → top */
/* The two layers are the two halves of the story: `base` is the screen a
   moment before it verified, `gold` is the screen after. The wash sweeping
   up is what turns one into the other, so each variation only has to supply
   its own before/after art and the screen does the rest. */
/* still art before, verified art after — the screen itself does not change
   colour any more, so the art carries the whole moment */
/* Each art finishes at its own pace, so the hand-off cannot be one constant:
   v1's fill runs 1.84s (printRun's 200 base + 1120 spread + 520 duration), v2's
   swell about 2.4s, v3's 5.2s. Pinning it to v3 left v1 sitting finished for four
   seconds. Passed as a FUNCTION, not a getter: def() runs Object.assign over the
   options, which reads a getter there and then — and `state` is declared further
   down the file, so a getter threw on load and took the whole script with it. A
   function reference copies untouched and the engine calls it on entry. */
/* The exact moment each art is fully orange — no trailing beat, because the
   title turn and the button rising are meant to land on that frame. */
function verifyArtMs(){
  if(state.verifyArt==='v3') return V3.sweep;                /* 3000, no hold */
  if(state.verifyArt==='v2') return verifyScanMs() + NL_SCAN.fillMs;
  return 200 + 2600 + 700;                                   /* 3500, printRun's own span */
}
/* When the scanning stops and the final upward fill begins. Only v2 has the two
   as separate phases; for v1 and v3 the fill IS the whole animation. */
function verifyScanMs(){
  return state.verifyArt==='v2'
    ? NL_SCAN.passes*NL_SCAN.pass          /* no hold — the scan is the wait */
    : verifyArtMs();
}
/* Three states, not two. v1's print emits no fill layer at all in `still`, so
   passing a boolean meant the verifying screen got `still` and had nothing to
   animate — the print just sat there grey. The mode is now explicit:
     still  — grey only, for the intro screen
     verify — grey plus a fill that animates in
     done   — the fill already complete, after verification            */
function verifyArtHTML(mode){
  if(state.verifyArt==='v3')
    return `<canvas class="printlines" width="${V3.size}" height="${V3.size}"></canvas>`;
  return state.verifyArt==='v2'
    ? `<canvas class="linecard" width="${NL_CARD.w}" height="${NL_CARD.h}"></canvas>`
    : printArt((mode==='loop'||mode==='idle') ? 'still' : mode);
}
/* One entry point for all three arts. Each is a no-op when its own element is
   absent, and printRun additionally bails on a print that is already .done. */
function verifyArtRun(el, mode, dark){
  el.dataset.vfmode=mode;
  nlRun(el, mode, dark);
  v3Run(el, mode, dark);
  printRun(el);
}
/* The gold/dark wash this screen used to run is gone: it sits on the same
   white as the screen before it, and the only thing that happens is the
   illustration verifying itself. The .vlayer CSS is left in place, unused,
   in case the wash comes back. */
def('id-verified-msg','6096:6242 (redesigned)',
  ()=>`
  ${nav(3,7)}
  <div class="body">
    <div class="head center"><h1>Your information<br>was verified</h1>
      <p class="sub center">Next, you can link a bank account  as your funding source to create your first card.</p></div>
    <div class="artpanel">${verifyArtHTML('done')}</div>
  </div>
  <div class="foot"><button class="btn" data-go="fund-source">Set up my first card</button></div>`,
  { enter:'fade', onEnter(el){
      verifyArtRun(el,'done');
    } });

/* ---------- 13. Funding source — 6102:6533 ---------- */
def('fund-source','6102:6533',`
  ${nav(4,7)}
  <div class="body flush">
    <div class="head" style="padding:38px 20px 0"><h1 class="tight">Link your funding source</h1>
      <p class="sub">Protect your <u style="text-underline-offset:3px">card or bank account</u></p></div>
    <div style="height:170px"></div>
    <div class="listgroup">
      <div class="listrow" data-go="fund-card"><span class="badge">${I.credit}</span>
        <span class="t"><b>Credit card</b><span>Click to solve the CAPTCHA</span></span>${I.arrowR}</div>
      <div class="listrow" data-go="fund-card"><span class="badge">${I.debit}</span>
        <span class="t"><b>Debit card</b><span>Click to solve the CAPTCHA</span></span>${I.arrowR}</div>
      <div class="listrow" data-go="fund-card"><span class="badge">${I.bank}</span>
        <span class="t"><b>Bank account</b><span>Click to solve the CAPTCHA</span></span>${I.arrowR}</div>
    </div>
  </div>
`);

/* ---------- 14-16. Card information — 6111:6952 · 6120:7535 · 6163:5779 ---------- */
/* All three Figma frames are states of ONE screen, not three pages:
   empty+keyboard (6111:6952) → filled+keyboard (6120:7535) → filled+CTA
   (6163:5779). Toggled by class in place, so there is no page transition;
   only the keyboard slides.                                              */
function cfField(key,ph,val,caret){
  return `<div class="field" data-cf="${key}">
    ${caret?'<span class="cf-caret">|</span>':''}
    <span class="cf-ph">${ph}</span><span class="cf-val">${val}</span></div>`;
}
def('fund-card','6111:6952 · 6120:7535 · 6163:5779',`
  ${nav(4,7)}
  <div class="body cardbody">
    <div class="head" style="padding-bottom:32px"><h1 class="tight">Enter card information</h1></div>
    <div class="pushdown"></div>
    <div class="fields" style="margin-top:0;gap:24px">
      <div class="fieldgroup"><label class="caps">Name as it appears on card</label>
        ${cfField('name','Name as it appears on card','Margaret Lee',true)}</div>
      <div class="fieldgroup"><label class="caps">Card number*</label>
        ${cfField('num','1234 1234 1234 1234','4253 2452 3562 3523')}</div>
      <div class="fieldrow">
        <div class="fieldgroup"><label class="caps">Expiration date</label>
          ${cfField('exp','MM/DD','02/30')}</div>
        <div class="fieldgroup"><label class="caps">CVV</label>
          ${cfField('cvv','123','415')}</div>
      </div>
    </div>
    <p class="hint cf-hint">This is a secure and encrypted form.</p>
    <div class="pushup"></div>
  </div>
  <div class="foot cf-foot"><button class="btn" data-go="fund-linked">Continue</button></div>
  ${keyboard(false,'kbslide')}
`,{ onEnter(el){
  /* measure first, then let it slide up — reading offsetHeight after the
     class change would fight the transition */
  const kb=el.querySelector('.kb');
  const h=(kb && kb.offsetHeight)||274;
  el.style.setProperty('--kb-h', h+'px');
  el.classList.add('cf-kbdown');                 /* keyboard starts offscreen */
  requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.remove('cf-kbdown')));
}});

/* ---------- 17. Funding linked — 6168:7923 ---------- */
def('fund-linked','6168:7923 (relayout)',`
  ${nav(5,7)}
  <div class="body">
    <div class="head"><h1 class="tight">Your funding source is linked</h1>
      <span class="link muted" data-sheet="payments">How payment work</span></div>
    <div style="height:96px"></div>
    ${acct()}
    <p class="bodytext">For your convenience, AutoPay <span class="info-i" data-sheet="autopay">i</span>
       is enabled for linked payment methods. You may disable AutoPay in Settings anytime.</p>
  </div>
  <div class="foot"><button class="btn" data-go="purpose">Continue</button></div>
`);

/* ---------- 18. Card purpose — 6199:40720 · 6199:40934 ---------- */
const PURPOSES=[
  ['Single use','Cards close automatically after one purchase'],
  ['Subscription','Auto renewed every payment cycle'],
  ['Basic','You decide how to use the card']
];
def('purpose','6199:40720 · 6199:40934',`
  ${nav(1,7,{back:true})}
  <div class="body">
    <div class="head"><h1 class="tight">What do you want use card for</h1>
      <p class="sub">Select from a recommended configuration for your first card</p></div>
    <div class="optcards">
      ${PURPOSES.map(([t,d])=>`<div class="optcard" data-pick="purpose" data-val="${t}"><b>${t}</b><span>${d}</span></div>`).join('')}
    </div>
  </div>
  <div class="foot"><button class="btn" data-go="usecase" data-needs="purpose">Continue</button></div>
`,{ onEnter(el){ syncPick(el,'purpose'); } });

/* ---------- 19. Use case — 6221:51499 · 6221:51765 ---------- */
/* from Assets/icons — fills swapped to currentColor so the selected
   (dark) tile inverts them. No heart or dollar exists in the set yet,
   so those two remain hand-drawn. */
const TILE_ICONS={
  dollar:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.4v9.2M14.3 9.6c0-1-1-1.6-2.3-1.6s-2.3.7-2.3 1.7 1 1.5 2.3 1.7 2.4.6 2.4 1.7-1.1 1.7-2.4 1.7-2.3-.6-2.3-1.6" stroke-linecap="round"/></svg>`,
  heart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.6-4.7-7.6-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.6 2.8C19.6 15.3 12 20 12 20Z"/></svg>`,
  shopping:`<svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.625 18C9.66053 18 10.5 18.8395 10.5 19.875C10.5 20.9105 9.66053 21.75 8.625 21.75C7.58947 21.75 6.75 20.9105 6.75 19.875C6.75 18.8395 7.58947 18 8.625 18ZM8.625 19.5C8.41789 19.5 8.25 19.6679 8.25 19.875C8.25 20.0821 8.41789 20.25 8.625 20.25C8.83211 20.25 9 20.0821 9 19.875C9 19.6679 8.83211 19.5 8.625 19.5Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M16.125 18C17.1605 18 18 18.8395 18 19.875C18 20.9105 17.1605 21.75 16.125 21.75C15.0895 21.75 14.25 20.9105 14.25 19.875C14.25 18.8395 15.0895 18 16.125 18ZM16.125 19.5C15.9179 19.5 15.75 19.6679 15.75 19.875C15.75 20.0821 15.9179 20.25 16.125 20.25C16.3321 20.25 16.5 20.0821 16.5 19.875C16.5 19.6679 16.3321 19.5 16.125 19.5Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.0249 3.75C3.68253 3.7501 4.26322 4.17861 4.45752 4.80688L5.12476 6.96533H19.2334C20.2433 6.9655 20.9643 7.94355 20.666 8.90845L18.4146 16.1931C18.2203 16.8215 17.639 17.25 16.9812 17.25H7.84058C7.18281 17.25 6.6015 16.8215 6.40723 16.1931L3.0249 5.25H0.75V3.75H3.0249ZM7.84058 15.75H16.9812L19.2334 8.46533H5.58838L7.84058 15.75Z" fill="currentColor"/></svg>`,
  card:`<svg viewBox="0 0 24 24" fill="none"><path d="M12.75 17.25H3.75V15.75H12.75V17.25Z" fill="currentColor"/> <path d="M12.75 14.25H3.75V12.75H12.75V14.25Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M20.3416 3.75C21.8718 3.75 23.25 4.88434 23.25 6.44385V17.5562C23.25 19.1157 21.8718 20.25 20.3416 20.25H3.65845C2.12819 20.25 0.750001 19.1157 0.75 17.5562V6.44385C0.75 4.88434 2.12818 3.75 3.65845 3.75H20.3416ZM2.25 17.5562C2.25 18.1434 2.80506 18.75 3.65845 18.75H20.3416C21.1949 18.75 21.75 18.1434 21.75 17.5562V9.75H2.25V17.5562ZM3.65845 5.25C2.80506 5.25 2.25 5.8566 2.25 6.44385V8.25H21.75V6.44385C21.75 5.8566 21.1949 5.25 20.3416 5.25H3.65845Z" fill="currentColor"/></svg>`,
  apps:`<svg viewBox="0 0 24 24" fill="none"><path d="M6.65552 11.0508L7.91895 10.3228L8.46313 11.2646L7.19824 11.9941L8.46313 12.7251L7.91895 13.667L6.65552 12.936V14.4023H5.56787V12.9346L4.29419 13.6714L3.75 12.7295L5.02222 11.9941L3.75 11.2603L4.29419 10.3184L5.56787 11.0522V9.58887H6.65552V11.0508Z" fill="currentColor"/> <path d="M12.5493 11.0508L13.8127 10.3228L14.3569 11.2646L13.0913 11.9941L14.3569 12.7251L13.8127 13.667L12.5493 12.936V14.4023H11.4609V12.9346L10.1873 13.6714L9.64307 12.7295L10.9153 11.9941L9.64307 11.2603L10.1873 10.3184L11.4609 11.0522V9.58887H12.5493V11.0508Z" fill="currentColor"/> <path d="M18.4424 11.0508L19.7058 10.3228L20.25 11.2646L18.9851 11.9941L20.25 12.7251L19.7058 13.667L18.4424 12.936V14.4023H17.354V12.9346L16.0811 13.6714L15.5369 12.7295L16.8091 11.9941L15.5369 11.2603L16.0811 10.3184L17.354 11.0522V9.58887H18.4424V11.0508Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.3896 2.25C22.4169 2.25 23.25 3.08307 23.25 4.11035V19.8896C23.25 20.9169 22.4169 21.75 21.3896 21.75H2.61035C1.58307 21.75 0.750001 20.9169 0.75 19.8896V4.11035C0.75 3.08307 1.58307 2.25 2.61035 2.25H21.3896ZM2.61035 3.75C2.4115 3.75 2.25 3.9115 2.25 4.11035V19.8896C2.25 20.0885 2.4115 20.25 2.61035 20.25H21.3896C21.5885 20.25 21.75 20.0885 21.75 19.8896V4.11035C21.75 3.9115 21.5885 3.75 21.3896 3.75H2.61035Z" fill="currentColor"/></svg>`,
  other:`<svg viewBox="0 0 24 24" fill="none"><line x1="11.75" y1="2" x2="11.75" y2="20" stroke="currentColor" stroke-width="1.5"/> <line x1="3" y1="11.25" x2="21" y2="11.25" stroke="currentColor" stroke-width="1.5"/> <line x1="18.2584" y1="4.53033" x2="5.53043" y2="17.2583" stroke="currentColor" stroke-width="1.5"/> <line x1="5.53033" y1="4.46967" x2="18.2583" y2="17.1976" stroke="currentColor" stroke-width="1.5"/></svg>`,
};
const USES=[['Pay my<br>bill','dollar'],['Dating<br>safely','heart'],
            ['Shopping<br>online','shopping'],['Marketplace<br>purchases','card'],
            ['Try<br>new apps','apps'],['Other<br>reason','other']];
def('usecase','6221:51499 · 6221:51765',`
  ${nav(1,7)}
  <div class="body">
    <div class="head" style="padding-bottom:0"><h1 class="tight">What's this card used for?</h1></div>
    <div class="tiles">
      ${USES.map(([t,ic])=>`<div class="tile" data-pick="usecase" data-val="${t.replace(/<br>/g,' ')}">${TILE_ICONS[ic]}<b>${t}</b></div>`).join('')}
    </div>
    <div style="height:24px"></div>
  </div>
  <div class="foot"><div class="btnrow">
    <button class="btn secondary narrow">Explore more</button>
    <button class="btn" data-go="name-card" data-needs="usecase">Continue</button>
  </div></div>
`,{ onEnter(el){ syncPick(el,'usecase'); } });

/* ---------- 20 & 21. Name the card + merchant detect — 6221:52071 · 6221:52304 ---------- */
/* one screen, keyboard up (6221:52071 and 52304 are states, not pages).
   Tap outside the keyboard to dismiss it and reveal Continue. */
def('name-card','6221:52071 · 6221:52304',`
  ${nav(3,4)}
  <div class="body cardbody namebody">
    <div class="head"><h1 class="tight" id="nameTitle"></h1></div>
    <div class="pushdown"></div>
    <div class="fields">
      <div class="field namefield">
        <span class="nametext"></span><span class="typecaret"></span>
        <input class="nameghost" id="cname" value="" autocomplete="off">
      </div>
    </div>
    <div id="mslot"></div>
    <div class="pushup"></div>
  </div>
  <div class="foot cf-foot"><button class="btn" data-go="limit-pad">Continue</button></div>
  ${keyboard(true,'kbslide')}
`,{ onEnter(el){
  el.querySelector('#nameTitle').textContent =
    state.purpose==='Subscription' ? 'Which subscription is this for'
                                   : 'Give a name of your virtual ID';
  const inp=el.querySelector('#cname');
  const prefilled = !state.merchant;

  /* Set the keyboard state BEFORE any layout read. Measuring offsetHeight
     flushes layout, which records the keyboard-up state — adding cf-down
     after that made it slide away on arrival. cf-instant also suppresses
     the transition for the first frame as a belt-and-braces guard. */
  if(prefilled) el.classList.add('cf-instant','cf-down');

  const kb=el.querySelector('.kb');
  if(kb) el.style.setProperty('--kb-h', (kb.offsetHeight||274)+'px');

  if(prefilled){
    inp.value = state.cardName || '';
    renderDetect(el);
    requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.remove('cf-instant')));
  }else{
    /* merchant path: keyboard up, name typed out so detection reads live */
    typeInto(el, inp, state.cardName || '');
  }
} });

/* ---------- 23. Amount keypad — 6199:39345 · 6199:39587 ---------- */
def('limit-pad','6199:39345 · 6199:39587',`
  ${nav(3,4)}
  <div class="body" style="flex:0 0 auto;overflow:visible">
    <div class="head"><h1 class="tight">Set card limit</h1></div>
    <div class="amount mid"><span class="cur">$</span><span class="val" data-amount>0</span><span class="amtcaret"></span></div>
    <button class="maxpill" data-max="50">Maximum - $50</button>
  </div>
  <div style="flex:1"></div>
  ${numpad()}
  <div class="foot"><button class="btn" data-go="preview" data-needs="amount">Preview</button></div>
`,{ onEnter(el){ syncAmount(el); } });

/* ---------- 24. Preview — 6199:40516 ---------- */
def('preview','6199:40516',`
  ${nav(4,4)}
  <div class="body" style="flex:0 0 auto;overflow:visible">
    <div class="head"><h1 class="tight">Confirm detail</h1></div>
    <div class="amount"><span class="cur">$</span><span class="val" data-amount>0</span></div>
    <div class="rows full" style="margin-top:44px">
      <div class="row"><span>Pay to</span><span class="v" data-f="cardName"></span></div>
      <div class="row"><span>Funding account</span><span class="v withlogo">
        <span style="width:22px;height:22px;display:inline-block">${chaseLogo}</span>Chase 4252</span></div>
      <div class="row tap" data-sheet="frequency"><span>Frequency</span><span class="v" data-f="typeLabel"></span></div>
    </div>
    <p class="bodytext" style="margin-top:18px">By default, your spending limit is set to
      <span data-f="typeLabel"></span>, which you can update anytime in Card Setting</p>
  </div>
  <div style="flex:1"></div>
  <div class="foot"><button class="btn" data-go="creating">Create virtual card</button></div>
`,{ onEnter(el){ syncAmount(el); syncFields(el); } });

/* ---------- 25. Creating — 6221:52835 ---------- */
def('creating','6221:52835',`
  ${nav(1,4,{tone:'ondark',noback:true})}
  <div class="body">
    <div class="head"><h1 class="big">Creating your<br>virtual card now...</h1></div>
    <div class="skelout"><div class="skelin"></div></div>
  </div>
`,{ dark:true, light:true, autoTo:'ready', autoMs:2400, onEnter(){ setStatus(true); } });

/* ---------- 26. Ready — brand reveal — 6221:52864 ----------
   The screen is rendered twice: the dark "creating" state underneath, and the
   finished card on top revealed by a soft gradient mask that sweeps upward.
   A mask (not a clip or a colour flood) so it works over video too. */
function readyLayer(tone){
  const live = tone==='live';
  return `
  ${nav(4,4,{noback:true,noprogress:true,tone:'onbrand'})}
  <div class="head"><h1 class="tight">Your first virtual ID<br>is ready!</h1></div>
  <div class="cardpanel">
    <div class="ptop"><b data-f="cardName"></b><span data-f="purpose"></span></div>
    <div class="bigcard">
      ${live?'<video class="cardvideo" autoplay muted loop playsinline></video>':''}
      <span class="custom">Custom</span>
      <span class="mark" data-f="mark"></span>
      <span class="last4">.2425</span>
    </div>
    <div class="prow"><span>Available balance</span><span data-f="amountFmt"></span></div>
    <div class="prow"><span>Card limit</span><span data-f="amountFmt"></span></div>
  </div>
  <div style="flex:1"></div>
  <div class="foot" style="padding:16px 0 34px"><div class="btnrow">
    <button class="btn onbrand-ghost">Add to wallet</button>
    <button class="btn onbrand" data-act="restart">Done</button>
  </div></div>`;
}
def('ready','6221:52864',`
  <div class="brandscreen">
    <div class="rlayer dark">${readyLayer('dark')}</div>
    <div class="rlayer live masksweep">
      <video class="brandvideo" autoplay muted loop playsinline></video>
      <div class="brandscrim"></div>
      <div class="rinner">${readyLayer('live')}</div>
    </div>
  </div>
`,{ light:true, onEnter(el){ paintBrand(el); syncFields(el); setStatus(true); } });

/* ============================================================
   STATE + RUNTIME
   ============================================================ */
const ORDER=['intro-v1','intro-v2','intro-v3','intro-v4','welcome','id-intro','id-intro-v1','id-intro-v2','id-intro-v3','id-name','id-dob','id-address','id-phone','id-ssn','id-review',
  'id-agreement','id-verifying','id-verified','id-verified-msg','fund-source','fund-card','fund-linked','purpose','usecase','name-card',
  'limit-pad','preview','creating','ready'];

/* which of the four intro variations was last chosen — the verified screen
   pays that same art off, so the two ends of the flow stay one idea */
const VERIFY_ART={'id-intro-v1':'v1','id-intro-v2':'v2'};
const state={ verifyArt:'v1', amount:'', purpose:'', usecase:'', cardName:'Pay my bill',
              merchant:null, freq:'Monthly' };
let stack=[], current=null, timer=null;

const screensEl=document.getElementById('screens');
let currentEl=null;
/* long enough for the fade and the staggered line-out, whichever is slower */
function EXIT_MS(){
  const n=v=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue(v))||0;
  return Math.max(n('--dur-fade'), n('--dur-lineout')+n('--del-line')*2)+40;
}




function setStatus(){}
function fmt(){
  if(!state.amount) return '0';
  const [a,b]=state.amount.split('.');
  const s=Number((a||'0').replace(/^0+(?=\d)/,'')||0).toLocaleString('en-US');
  return b!==undefined ? s+'.'+b : s;
}
function amountNum(){ return parseFloat(state.amount||'0')||0; }

function syncAmount(el){
  el.querySelectorAll('[data-amount]').forEach(n=>n.textContent=fmt());
  const a=el.querySelector('.amount');
  if(a) a.classList.toggle('mid', amountNum()===0);
  el.querySelectorAll('[data-needs="amount"]').forEach(b=>
    amountNum()>0 ? b.removeAttribute('disabled') : b.setAttribute('disabled',''));
}
function syncPick(el,key){
  el.querySelectorAll(`[data-pick="${key}"]`).forEach(o=>
    o.classList.toggle('on', o.dataset.val===state[key]));
  el.querySelectorAll(`[data-needs="${key}"]`).forEach(b=>
    state[key] ? b.removeAttribute('disabled') : b.setAttribute('disabled',''));
}
function syncFields(el){
  const m=state.merchant;
  const vals={
    cardName: state.cardName || 'Untitled card',
    purpose: state.purpose || 'Basic',
    typeLabel: state.freq,          /* the row is Frequency now, not card type */
    amountFmt: '$'+amountNum().toFixed(2),
    mark: m ? m.name.charAt(0).toUpperCase() : CLOAKED_MARK,
    readyTitle: 'Your first virtual ID<br>is ready!'
  };
  el.querySelectorAll('[data-f]').forEach(n=>{
    const v=vals[n.dataset.f]; if(v!==undefined) n.innerHTML=v;
  });
}
function paintBrand(el){
  const th = USECASE_THEME[state.usecaseKey]||{};
  const m  = state.merchant;
  const dating = th.art==='dating';
  el.classList.toggle('art-dating', dating);

  const brand = m ? m.brand : '#1c1b18';
  el.style.setProperty('--brand', brand);
  el.style.setProperty('--brand-deep', darken(brand,.46));   /* page sits darker than the card */
  el.style.setProperty('--brand-on', dating ? '#f3f1ed' : onBrand(brand));
  setStatus(true);

  if(dating){
    el.querySelectorAll('video').forEach(v=>{
      v.src=DATING_BG;
      /* play() returns undefined in some engines, so guard before .catch */
      const pr = v.play && v.play();
      if(pr && typeof pr.catch==='function') pr.catch(()=>{});
    });
  }
}
/* simulate typing so merchant detection reads as a live consequence */
let typeTimer=null;
function typeInto(el, inp, text){
  clearTimeout(typeTimer);
  inp.value=''; renderDetect(el);
  let i=0;
  const step=()=>{
    if(!el.isConnected) return;
    inp.value = text.slice(0, ++i);
    renderDetect(el);
    if(i < text.length) typeTimer=setTimeout(step, 95);
  };
  typeTimer=setTimeout(step, 420);
}
/* masked vs revealed SSN, driven by the numpad */
function renderSSN(el){
  const inp=el.querySelector('#ssn'); if(!inp) return;
  const raw=inp.dataset.raw||'';
  const grp=(d,ch)=>d.slice(0,3)+(d.length>3?ch+d.slice(3,5):'')+(d.length>5?ch+d.slice(5,9):'');
  const shown=el.classList.contains('ssn-shown');
  el.querySelector('.ssntext').textContent =
    shown ? grp(raw,'-') : grp('*'.repeat(raw.length),' ');
  el.querySelector('.ssnph').style.display = raw ? 'none' : '';
  const b=el.querySelector('[data-needs="ssn"]');
  if(b) raw.length===9 ? b.removeAttribute('disabled') : b.setAttribute('disabled','');
}
function renderDetect(el){
  const slot=el.querySelector('#mslot'); if(!slot) return;
  const inp=el.querySelector('#cname');
  const mirror=el.querySelector('.nametext');
  if(mirror) mirror.textContent = inp.value;   /* keeps the caret glued to the text */
  state.cardName = inp.value;
  const m=detectMerchant(inp.value);
  state.merchant=m;
  slot.innerHTML = m ? `<div class="mdetect">
      <div class="cap">Merchant detected</div>
      <div class="hit"><span class="mmark" style="background:${m.markBg};color:${m.markColor}">${m.mark||m.name.charAt(0)}</span>
        <span>${m.name}</span></div>
    </div>` : '';
}

/* ---------- render ---------- */
function render(id,back){
  if(timer){ clearTimeout(timer); timer=null; }
  const d=S[id]; if(!d) return;
  /* the outgoing screen stays in the DOM long enough to fade out and send
     its title up, so the two titles hand off instead of cutting */
  /* if navigation outruns the fade, drop any screen already on its way out
     so at most two are ever live */
  screensEl.querySelectorAll('.screen.exiting').forEach(n=>n.remove());
  const prev = currentEl;
  if(prev){
    prev.classList.remove('active');
    prev.classList.add('active','exiting');
    prev.querySelectorAll('.head h1, .head .sub, .wl-title').forEach(n=>{
      n.classList.remove('linesin');
      if(n.querySelector('.ln')) n.classList.add('leaving');
    });
    /* the outgoing screen is inert — drop its ids so it can never be picked
       up by getElementById / scoped '#id' lookups while both are live */
    prev.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
    prev.removeAttribute('id');
    setTimeout(()=>prev.remove(), EXIT_MS());
  }
  const sec=document.createElement('section');
  sec.className=`screen active ${d.dark?'dark ':''}${d.notop?'notop ':''}${d.layers?'layers ':''}fade`;
  sec.dataset.id=id;
  sec.innerHTML = typeof d.html==='function' ? d.html() : d.html;
  screensEl.appendChild(sec);
  const el=sec;
  currentEl=el;
  current=id;
  setStatus(!!d.light);
  if(d.onEnter) d.onEnter(el);
  revealHead(el);
  markJumpPanel(id);
  closeSheet(true);
  if(d.autoTo){
    const pre = d.delay ? MOTION[d.delay].dur*slowmo : 0;
    /* autoMs may be a function, for a screen whose length depends on live state */
    const auto = typeof d.autoMs==='function' ? d.autoMs() : d.autoMs;
    const ms = d.autoAt ? pre + MOTION[d.autoAt].dur*slowmo + (d.hold||260) : auto*slowmo;
    timer=setTimeout(()=>go(d.autoTo), ms);
  }
}
/* which name to suggest and how the finished card is themed, per use case */
const CLOAKED_MARK=`<svg viewBox="0 0 59 59" fill="none" aria-hidden="true"><path d="M8.87186 32.5039C10.333 32.5039 12.5464 33.6641 15.8914 35.4834C16.93 36.0492 18.0904 36.6793 19.3152 37.3096L17.2596 42.4092C14.2513 41.2632 8.04862 38.3914 6.98124 35.4619C6.73056 34.7672 6.79473 34.1153 7.18143 33.4707C7.57536 32.8046 8.12701 32.5039 8.87186 32.5039ZM32.2566 11.6816C32.6145 11.6817 32.9223 11.8391 33.1014 12.1182C35.3003 15.5419 38.4522 20.3487 40.9305 23.7725C44.168 28.2491 49.3749 34.6453 50.8289 36.4287C49.3675 37.933 44.7118 41.6788 35.0857 40.9482L34.9568 40.9336C34.1976 40.8548 30.4514 40.4327 27.2713 39.3584C24.485 38.4129 20.3087 36.3493 20.2801 36.335C19.2059 35.762 18.1814 35.1963 17.2146 34.6592C14.4428 33.1193 12.1579 31.852 10.2957 31.3506C15.5172 28.1417 25.5379 20.9139 31.3182 12.1611C31.5187 11.8606 31.8695 11.6818 32.2488 11.6816H32.2566Z" fill="currentColor"/></svg>`;
const USECASE_THEME={
  'Pay my bill'          :{name:'Verizon',        merchant:'verizon'},
  'Dating safely'        :{name:'Dating safety',  art:'dating'},
  'Shopping online'      :{name:'Amazon',         merchant:'amazon'},
  'Marketplace purchases':{name:'Marketplace',    art:'plain'},
  'Try new apps'         :{name:'New apps',       art:'plain'},
  'Other reason'         :{name:'My card',        art:'plain'}
};
function darken(hex,amt){
  const n=parseInt(hex.slice(1),16);
  const c=[(n>>16)&255,(n>>8)&255,n&255].map(v=>Math.round(v*(1-amt)));
  return '#'+c.map(v=>v.toString(16).padStart(2,'0')).join('');
}

/* ---- bottom sheets ---- */
/* calendar set from Assets/icons/Calendar — fill follows currentColor */
const CAL={
  day:`<svg class="ic" viewBox="0 0 24 24" fill="none"><path d="M9 4.5H15V3H16.5V4.5H19.5C20.3284 4.5 21 5.17157 21 6V19.5C21 20.3284 20.3284 21 19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V6C3 5.17157 3.67157 4.5 4.5 4.5H7.5V3H9V4.5ZM4.5 19.5H19.5V6H16.5V7.5H15V6H9V7.5H7.5V6H4.5V19.5ZM13.75 14.25H10.75V11.25H13.75V14.25Z" fill="currentColor"/></svg>`,
  week:`<svg class="ic" viewBox="0 0 24 24" fill="none"><path d="M9 4.5H15V3H16.5V4.5H19.5C20.3284 4.5 21 5.17157 21 6V19.5C21 20.3284 20.3284 21 19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V6C3 5.17157 3.67157 4.5 4.5 4.5H7.5V3H9V4.5ZM4.5 19.5H19.5V6H16.5V7.5H15V6H9V7.5H7.5V6H4.5V19.5ZM16.5 13.875H7.5V12.375H16.5V13.875Z" fill="currentColor"/></svg>`,
  twoweek:`<svg class="ic" viewBox="0 0 24 24" fill="none"><path d="M9 4.5H15V3H16.5V4.5H19.5C20.3284 4.5 21 5.17157 21 6V19.5C21 20.3284 20.3284 21 19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V6C3 5.17157 3.67157 4.5 4.5 4.5H7.5V3H9V4.5ZM4.5 19.5H19.5V6H16.5V7.5H15V6H9V7.5H7.5V6H4.5V19.5ZM16.5 16.125H7.5V14.625H16.5V16.125ZM16.5 12.375H7.5V10.875H16.5V12.375Z" fill="currentColor"/></svg>`,
  month:`<svg class="ic" viewBox="0 0 24 24" fill="none"><path d="M9 4.5H15V3H16.5V4.5H19.5C20.3284 4.5 21 5.17157 21 6V19.5C21 20.3284 20.3284 21 19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V6C3 5.17157 3.67157 4.5 4.5 4.5H7.5V3H9V4.5ZM4.5 19.5H19.5V6H16.5V7.5H15V6H9V7.5H7.5V6H4.5V19.5ZM9 16.875H7.5V15.375H9V16.875ZM12.75 16.875H11.25V15.375H12.75V16.875ZM16.5 16.875H15V15.375H16.5V16.875ZM9 13.875H7.5V12.375H9V13.875ZM12.75 13.875H11.25V12.375H12.75V13.875ZM16.5 13.875H15V12.375H16.5V13.875ZM9 10.875H7.5V9.375H9V10.875ZM12.75 10.875H11.25V9.375H12.75V10.875ZM16.5 10.875H15V9.375H16.5V10.875Z" fill="currentColor"/></svg>`,
  year:`<svg class="ic" viewBox="0 0 24 24" fill="none"><path d="M9 4.5H15V3H16.5V4.5H19.5C20.3284 4.5 21 5.17157 21 6V19.5C21 20.3284 20.3284 21 19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V6C3 5.17157 3.67157 4.5 4.5 4.5H7.5V3H9V4.5ZM4.5 11.75V19.5H19.5V11.75H4.5ZM4.5 10.25H19.5V6H16.5V7.5H15V6H9V7.5H7.5V6H4.5V10.25Z" fill="currentColor"/></svg>`,
};

/* frequency options — used by the picker sheet (6211:45911) */
const FREQS=[['Everyday','Monday - Friday',CAL.day],['Every week','On Wednesday',CAL.week],
             ['Every 2 weeks','Description',CAL.twoweek],['Monthly','On the 21th',CAL.month],
             ['Yearly','On Feb 15th',CAL.year]];

const SHEETS={
  autopay:{ node:'6195:36357', html:`
    <h2>About AutoPay</h2>
    <p>AutoPay ensures your Cloaked Virtual Cards always work by covering purchases as they
       happen. We'll only charge your payment method after a transaction is completed—never
       before. This includes Daily, Weekly, or Monthly Cloaked Pay Virtual Cards.</p>
    <p>AutoPay is currently on, but you can turn it off anytime in Settings.</p>
    <span class="link" data-sheet-close>See AutoPay Terms &amp; Conditions</span>
    <button class="btn" data-sheet-close>OK</button>` },

  payments:{ html:`
    <h2>How payments work</h2>
    <p>Virtual card payments are now linked to your VISA ending in 1349. Each charge is settled
       from that account — Cloaked never exposes the real number to the merchant.</p>
    <p>You can change or remove the funding source at any time in Settings.</p>
    <button class="btn" data-sheet-close>OK</button>` },

  frequency:{ node:'6211:45911', html:`
    <h2 class="serif">Frequency</h2>
    <div class="sheetlist">
      ${FREQS.map(([t,d,ic])=>`<div class="radiorow" data-pick="freq" data-val="${t}">${ic}
        <span class="t"><b>${t}</b><span>${d}</span></span><span class="radio"><i></i></span></div>`).join('')}
    </div>
    <button class="btn" data-sheet-close>Save</button>` },

  whyphone:{ html:`
    <h2>Why we need your number</h2>
    <p>Your mobile number is used to confirm it's you when you sign in and to alert you about
       card activity. It must be a number tied to this device.</p>
    <p>We never share it with merchants or use it for marketing.</p>
    <button class="btn" data-sheet-close>OK</button>` }
};
function openSheet(key){
  const sh=SHEETS[key]; if(!sh) return;
  const box=document.getElementById('sheet');
  box.innerHTML=sh.html;
  document.getElementById('scrim').classList.add('open');
  if(box.querySelector('[data-pick="freq"]')) syncPick(box,'freq');
}
function closeSheet(instant){
  const sc=document.getElementById('scrim');
  if(!sc.classList.contains('open')) return;
  if(currentEl) syncFields(currentEl);      /* reflect any sheet choice */
  if(instant){ sc.classList.remove('open','closing'); return; }
  sc.classList.add('closing');
  const ms=parseFloat(getComputedStyle(document.documentElement)
             .getPropertyValue('--dur-push'))||420;
  setTimeout(()=>sc.classList.remove('open','closing'), ms);
}

/* ---- record the flow, phone only -----------------------------------
   Region Capture (CropTarget) crops the tab stream to the phone element,
   so the file is exactly the device area. Falls back to drawing the
   captured tab into a 393x852 canvas clipped to the phone's rect.    */
let recorder=null, recChunks=[], recStream=null, recRaf=null, recOn=false;
function recLabel(t){ const b=document.getElementById('recBtn'); if(b) b.textContent=t; }

function cropViaCanvas(stream, el){
  const v=document.createElement('video');
  v.srcObject=stream; v.muted=true; v.playsInline=true;
  const pr=v.play(); if(pr && pr.catch) pr.catch(()=>{});
  const dpr=2, c=document.createElement('canvas');
  c.width=393*dpr; c.height=852*dpr;
  const x=c.getContext('2d');
  const draw=()=>{
    if(!recOn) return;
    const st=stream.getVideoTracks()[0].getSettings();
    const sx=(st.width||window.innerWidth)/window.innerWidth;
    const sy=(st.height||window.innerHeight)/window.innerHeight;
    const r=el.getBoundingClientRect();
    if(v.readyState>=2 && r.width>0)
      x.drawImage(v, r.left*sx, r.top*sy, r.width*sx, r.height*sy, 0,0,c.width,c.height);
    recRaf=requestAnimationFrame(draw);
  };
  recRaf=requestAnimationFrame(draw);
  return c.captureStream(60);
}

async function startRec(){
  const phone=document.getElementById('phone');
  try{
    recStream = await navigator.mediaDevices.getDisplayMedia({
      video:{frameRate:60}, audio:false, preferCurrentTab:true });
  }catch(e){ recLabel('Record flow'); return; }

  recOn=true;
  const track=recStream.getVideoTracks()[0];
  let out=null;
  if(window.CropTarget && track.cropTo){
    try{ await track.cropTo(await CropTarget.fromElement(phone)); out=recStream; }
    catch(e){ out=null; }
  }
  if(!out) out=cropViaCanvas(recStream, phone);

  const mime=['video/mp4;codecs=avc1','video/webm;codecs=vp9','video/webm']
    .find(t=>window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || '';
  recChunks=[];
  recorder=new MediaRecorder(out, mime?{mimeType:mime,videoBitsPerSecond:8e6}:undefined);
  recorder.ondataavailable=e=>{ if(e.data.size) recChunks.push(e.data); };
  recorder.onstop=()=>{
    const type=recorder.mimeType||'video/webm';
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob(recChunks,{type}));
    a.download='cloaked-pay-flow.'+(type.indexOf('mp4')>-1?'mp4':'webm');
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),4000);
    recLabel('Record flow');
  };
  track.addEventListener('ended', stopRec);
  recorder.start(200);
  recLabel('Stop + download');
  /* rewind to the top so the recording captures the flow from the first
     frame — including the cover load-in, which is otherwise already past */
  setTimeout(()=>{ if(recOn) restart(); }, 260);
}
function stopRec(){
  if(!recOn) return;
  recOn=false;
  if(recRaf) cancelAnimationFrame(recRaf);
  if(recorder && recorder.state!=='inactive') recorder.stop();
  if(recStream) recStream.getTracks().forEach(t=>t.stop());
  recStream=null;
}

/* ---- v2 name-lines controls: key, label, min, max, step, decimals ----
   Only the three that are still open. The settled values live in NL and
   never rebuild the mask, so everything here is read live by the frame
   loop — no dirty flag needed.                                         */
/* Settled 8/10: lines 40, thickness 1, swell 0.8 — they live in NL now and
   the tray carries only the name. The sliders were for finding these
   numbers, not for shipping them; put an entry back to reopen one. */
const NL_CTL=[];

/* ---- jump panel: four phases of the flow ---- */
const SECTIONS=[
  ['Intro',              ['intro-v1','intro-v2','intro-v3','intro-v4','welcome']],
  ['Verify identity',    ['id-verifying','id-intro','id-intro-v1','id-intro-v2','id-intro-v3','id-name','id-dob','id-address','id-phone','id-ssn',
                          'id-review','id-agreement','id-verifying','id-verified-msg']],
  ['Link account',       ['fund-source','fund-card','fund-linked']],
  ['Create virtual card',['purpose','usecase','name-card','frequency',
                          'limit-pad','preview','creating','ready']]
];
function buildJumpPanel(){
  document.getElementById('controls').innerHTML =
    `<section class="group">
       <span class="group-label divider">Flow</span>
       <div class="pills stack">
         ${SECTIONS.map(([name,ids],i)=>
           `<button class="pill" data-jump="${ids[0]}" data-sec="${i}" aria-pressed="false">${name}</button>`
         ).join('')}
       </div>
     </section>
     <section class="group">
       <span class="group-label divider">Intro Options</span>
       <div class="pills">
         <button class="pill" data-jump="intro-v1" data-cover="intro-v1" aria-pressed="false">v1</button>
         <button class="pill" data-jump="intro-v2" data-cover="intro-v2" aria-pressed="false">v2</button>
         <button class="pill" data-jump="intro-v3" data-cover="intro-v3" aria-pressed="false">v3</button>
         <button class="pill" data-jump="intro-v4" data-cover="intro-v4" aria-pressed="false">v4</button>
       </div>
     </section>
     <section class="group">
       <span class="group-label">Intro art</span>
       <div class="pills">
         <button class="pill" data-art="css"   aria-pressed="true">CSS</button>
         <button class="pill" data-art="photo" aria-pressed="false">Photo</button>
       </div>
     </section>
     <div class="grouprow">
       <section class="group">
         <span class="group-label">Card</span>
         <div class="pills">
           <button class="pill" data-cardo="v" aria-pressed="true">Vertical</button>
           <button class="pill" data-cardo="h" aria-pressed="false">Horizontal</button>
         </div>
       </section>
       <section class="group">
         <span class="group-label">Theme</span>
         <div class="pills">
           <button class="pill" data-theme="dark"  aria-pressed="true">Dark</button>
           <button class="pill" data-theme="light" aria-pressed="false">Light</button>
         </div>
       </section>
     </div>
     <section class="group">
       <span class="group-label divider">Verify Identity Options</span>
       <div class="pills">
         <button class="pill" data-va="v1" aria-pressed="false">v1</button>
         <button class="pill" data-va="v2" aria-pressed="false">v2</button>
         <button class="pill" data-va="v3" aria-pressed="false">v3</button>
       </div>
     </section>
     <section class="group nlgroup" id="grpName" hidden>
       <span class="group-label">Name · v2 &amp; v3</span>
       <input class="nlinput" id="nlName" type="text" value="${NL.name}"
              placeholder="Name" autocomplete="off" spellcheck="false">
       ${NL_CTL.map(([k,label,min,max,step,dp])=>
         `<div class="nlrow">
            <span class="nlkey">${label}</span>
            <b class="nlval" id="nlv-${k}">${(+NL[k]).toFixed(dp)}</b>
            <input type="range" data-nl="${k}" data-dp="${dp}"
                   min="${min}" max="${max}" step="${step}" value="${NL[k]}">
          </div>`).join('')}
     </section>
     <section class="group">
       <span class="group-label">Record</span>
       <div class="pills"><button class="pill" id="recBtn">Record flow</button></div>
     </section>`;
}
function markJumpPanel(id){
  const i = SECTIONS.findIndex(([,ids])=>ids.includes(id));
  document.querySelectorAll('[data-sec]').forEach(n=>
    n.setAttribute('aria-pressed', String(i)===n.dataset.sec ? 'true':'false'));
  document.querySelectorAll('[data-cover]').forEach(n=>
    n.setAttribute('aria-pressed', n.dataset.cover===id ? 'true':'false'));
  /* the variation pills track state, not a screen: both of them land on the
     same loading screen, so there is no id to match against */
  document.querySelectorAll('[data-va]').forEach(n=>
    n.setAttribute('aria-pressed', String(n.dataset.va===state.verifyArt)));
  /* the name-lines controls follow the chosen variation, not one screen —
     the payoff plays on the verified screen too */
  /* Both v2 and v3 build their initials from NL.name, so the field belongs to
     both — it was gated to v2 only. v1's print carries no name. */
  const g=document.getElementById('grpName');
  if(g) g.hidden = (state.verifyArt!=='v2' && state.verifyArt!=='v3');
}

/* live wiring for the v3 group — bound once, after the panel is built */
function wireV2Controls(){
  const name=document.getElementById('nlName');
  if(!name) return;
  name.addEventListener('input',()=>{ NL.name=name.value; nlReveal=0; nlDirty=true; });
  document.querySelectorAll('[data-nl]').forEach(el=>{
    el.addEventListener('input',()=>{
      const k=el.dataset.nl, dp=+el.dataset.dp;
      NL[k]=parseFloat(el.value);
      const out=document.getElementById('nlv-'+k);
      if(out) out.textContent=(+el.value).toFixed(dp);
      /* only these two change the mask the fields are derived from */
      if(k==='soft'||k==='size') nlDirty=true;
    });
  });
}

/* scale the frame so all 852px are visible even on a short window */
function fitPhone(){
  const wrap=document.getElementById('phonewrap');
  const ph=document.getElementById('phone');
  if(!wrap||!ph) return;
  const s=Math.min(1, Math.max(.5,(window.innerHeight-150)/852));
  ph.style.transformOrigin='top center';
  ph.style.transform = s<1 ? `scale(${s.toFixed(4)})` : 'none';
  wrap.style.height = Math.round(852*s)+'px';
  wrap.style.width  = Math.round(393*s)+'px';
}
window.addEventListener('resize',fitPhone);

function go(id,back){ if(!S[id])return; if(!back&&current) stack.push(current); render(id,back); }
function back(){ if(stack.length) render(stack.pop(),true); }
function restart(){ stack=[]; current=null; state.amount=''; state.purpose=''; state.usecase='';
  state.cardName='Pay my bill'; state.merchant=null; render('intro-v1'); }

/* ---------- clicks ---------- */
document.addEventListener('click',e=>{
  const t=e.target;


  if(t.closest('[data-act="back"]')){ back(); return; }
  if(t.closest('[data-act="close"]')){ restart(); return; }
  if(t.closest('[data-act="restart"]')){ restart(); return; }
  if(t.closest('[data-act="ssn"]')){
    currentEl.classList.toggle('ssn-shown'); renderSSN(currentEl); return; }
  if(false){ const i=document.getElementById('ssn');
    i.type=i.type==='password'?'text':'password'; return; }

  if(t.closest('[data-sheet-close]')){ closeSheet(); return; }
  if(t===document.getElementById('scrim')){ closeSheet(); return; }
  const sh=t.closest('[data-sheet]');
  if(sh && !t.closest('#sheet')){ openSheet(sh.dataset.sheet); return; }

  if(t.closest('#recBtn')){ recOn ? stopRec() : startRec(); return; }

  const sc=t.closest('[data-scrollto]');
  if(sc){ const tgt=currentEl.querySelector(sc.dataset.scrollto);
    if(tgt) tgt.scrollIntoView({behavior:'smooth',block:'start'}); return; }

  const th=t.closest('[data-theme]');
  if(th){
    document.body.classList.toggle('lightcover', th.dataset.theme==='light');
    document.querySelectorAll('[data-theme]').forEach(b=>
      b.setAttribute('aria-pressed', String(b===th)));
    render(current);
    return;
  }
  /* Orientation drives the photo and the CSS fan alike, on every version. The
     screens' markup is fixed at load, so this re-renders rather than mutating. */
  const co=t.closest('[data-cardo]');
  if(co){
    document.body.classList.toggle('cardh', co.dataset.cardo==='h');
    document.querySelectorAll('[data-cardo]').forEach(b=>
      b.setAttribute('aria-pressed', String(b===co)));
    render(current);
    return;
  }
  const art=t.closest('[data-art]');
  if(art){
    const photo = art.dataset.art==='photo';
    document.body.classList.toggle('fanart', !photo);
    document.querySelectorAll('[data-art]').forEach(b=>
      b.setAttribute('aria-pressed', String(b===art)));
    /* the photographed fan was shot on cream — it only works in light */
    const dk=document.querySelector('[data-theme="dark"]');
    const lt=document.querySelector('[data-theme="light"]');
    if(dk) dk.disabled = photo;
    if(photo){
      document.body.classList.add('lightcover');
      if(dk) dk.setAttribute('aria-pressed','false');
      if(lt) lt.setAttribute('aria-pressed','true');
    }
    render(current);                                /* rebuild with the other art */
    return;
  }
  /* picking a variation replays it from the loading screen, so the motion is
     the first thing you see rather than something you have to walk to */
  const va=t.closest('[data-va]');
  if(va){ state.verifyArt=va.dataset.va; stack=[]; go('id-verifying'); return; }

  const jump=t.closest('[data-jump]');
  if(jump){
    const v=VERIFY_ART[jump.dataset.jump];
    if(v) state.verifyArt=v;
    stack=[]; go(jump.dataset.jump); return;
  }

  const sum=t.closest('.acc2-sum');
  if(sum){ const a=sum.parentElement; accSet(a,!a.classList.contains('open')); return; }

  /* card-info: all state changes happen in place on one screen.
     Typing fills the fields; tapping anywhere outside the keyboard
     dismisses it, which reveals Continue. */
  if(current==='fund-card'){
    const el=currentEl;
    /* tapping a field brings the keyboard back up */
    if(t.closest('[data-cf]')){ el.classList.remove('cf-down'); el.classList.add('cf-filled'); return; }
    if(t.closest('.kb')){ el.classList.add('cf-filled'); return; }
    if(!el.classList.contains('cf-down') && !t.closest('button')){
      el.classList.add('cf-filled','cf-down'); return;
    }
  }

  /* any screen with a sliding keyboard: tap off it to dismiss and reveal the CTA */
  if(current!=='fund-card' && currentEl && currentEl.querySelector('.kbslide')){
    const el=currentEl;
    /* tapping the field brings the keyboard back up */
    if(t.closest('.field') || t.closest('input')){ el.classList.remove('cf-down'); return; }
    if(!t.closest('.kb') && !t.closest('button') && !el.classList.contains('cf-down')){
      el.classList.add('cf-down'); return;
    }
  }

  const pick=t.closest('[data-pick]');
  if(pick){ state[pick.dataset.pick]=pick.dataset.val;
    if(pick.dataset.pick==='usecase'){
      const th=USECASE_THEME[pick.dataset.val]||{};
      state.usecaseKey=pick.dataset.val;
      state.cardName=th.name||pick.dataset.val;      /* e.g. Pay my bill -> Verizon */
      state.merchant=th.merchant?Object.assign({key:th.merchant},MERCHANTS[th.merchant]):null;
    }
    syncPick(pick.closest('#sheet') || currentEl, pick.dataset.pick);
    return; }

  const mx=t.closest('[data-max]');
  if(mx){ state.amount=mx.dataset.max; syncAmount(currentEl); return; }

  const key=t.closest('[data-key]');
  if(key){
    const k=key.dataset.key;
    if(k==='del') state.amount=state.amount.slice(0,-1);
    else if(k==='.'){ if(!state.amount.includes('.')) state.amount=(state.amount||'0')+'.'; }
    else{ const n=state.amount+k;
      if((n.split('.')[1]||'').length<=2 && parseFloat(n)<=50) state.amount=n; }
    syncAmount(currentEl); return;
  }

  const ch=t.closest('[data-char]');
  if(ch){
    const el=currentEl, d=S[current]||{};
    const inp=el.querySelector(d.typeTarget||'#cname');
    if(inp){
      const c=ch.dataset.char;
      let raw = inp.dataset.raw!==undefined ? inp.dataset.raw : inp.value;
      if(d.fillAll){                     /* prototype shortcut: one tap fills it */
        raw = (c==='\b') ? '' : d.fillAll;
      }else{
        raw = (c==='\b') ? raw.slice(0,-1) : raw + c;
        if(d.maxLen) raw = raw.slice(0, d.maxLen);
      }
      if(inp.dataset.raw!==undefined) inp.dataset.raw = raw;
      inp.value = d.fmt ? d.fmt(raw) : raw;
      if(d.onType) d.onType(el);
      else renderDetect(el);
    }
    return;
  }

  if(t.closest('[data-kbgo]')){ const d=S[current];
    if(d && d.kbGo){ go(d.kbGo); return; } }

  const sk=t.closest('[data-skip]');
  if(sk && sk._end){                       /* it says Restart at this point */
    const box=sk.closest('.v2root');
    const sc2=box && box.querySelector('.v2scroll');
    if(sc2){ sc2.scrollTo({top:0, behavior:'smooth'}); return; }
  }
  const g=t.closest('[data-go]');
  /* On a standalone intro page the flow lives in its own file, so Start hands
     off to kyc.html instead of rendering the next screen in place. */
  if(g && window.CLOAKED_BOOT && window.CLOAKED_BOOT!=='welcome' && g.dataset.go==='welcome'){
    location.href='kyc.html'; return;
  }
  if(g){ if(g.hasAttribute('disabled')) return;
    go(g.dataset.go); return; }

  if(S[current] && S[current].tapAnywhere && t.closest('#phone')) go(S[current].tapAnywhere);
});

/* live typing in the name field */
document.addEventListener('input',e=>{
  if(e.target.id==='cname') renderDetect(currentEl);
});

document.addEventListener('keydown',e=>{
  if(document.activeElement && document.activeElement.tagName==='INPUT') return;
  if(e.key==='ArrowLeft') back();
  if(e.key==='ArrowRight'){ const i=ORDER.indexOf(current);
    if(i>-1&&i<ORDER.length-1) go(ORDER[i+1]); }
});

document.addEventListener('change',e=>{
});


/* Boot. A standalone version page sets window.CLOAKED_BOOT to the screen it
   wants and hides the tray; the hub leaves it unset and starts the full flow. */
document.body.classList.add('fanart');   /* the built fan is the default */
applyMotion(); fitPhone();
if(window.CLOAKED_BOOT){
  document.body.classList.add('solo');
  stack=[]; render(window.CLOAKED_BOOT);
}else{
  buildJumpPanel(); wireV2Controls(); restart();
}
