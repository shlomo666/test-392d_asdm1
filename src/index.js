
function diff(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter(item => !set2.has(item));
}


window.app = {
  onInput: function (sentence) {
    let fucked = sentence.replace(/([ ]?)fucking([ ]?)/g, (_, s1, s2) => (s1 && s2) ? ' ' : '');
    // console.log(fucked);

    const nouns = getNouns(fucked)
    const adjectives = getAdjectives(fucked)
    const infinitiveVerbs = getInfinitiveVerbs(fucked)
    nouns.forEach(noun => fucked = fucked.split(noun).join(`fucking ${noun}`));
    // console.log(fucked);
    adjectives.forEach(adjective => fucked = fucked.split(adjective).join(`fucking ${adjective}`));
    // console.log(fucked);

    fucked = fucked.split('fucking fucking').join('fucking');
    // console.log(fucked);
    fucked = fucked.replace(new RegExp(`fucking (${diff(adjectives, nouns).join('|')}) fucking (${nouns.join('|')})`, 'g'), '$1 fucking $2');
    // console.log(fucked);

    infinitiveVerbs.forEach(verb => fucked = fucked.split(verb).join(`fucking ${verb}`));
    // console.log(fucked);

    fucked = fucked.split('fucking fucking').join('fucking');
    // console.log(fucked);
    fucked = fucked.replace(new RegExp(`fucking (${nouns.join('|')}) fucking (${infinitiveVerbs.join('|')})`, 'g'), '$1 fucking $2');
    // console.log(fucked);
    fucked = fucked.replace(new RegExp(`fucking (${infinitiveVerbs.join('|')}) fucking (${[...nouns, ...adjectives].join('|')})`, 'g'), '$1 fucking $2');
    // console.log(fucked);

    output.innerText = fucked;
  }
}

function getNouns(text) {
  // doc=nlp(`a person who is deemed to be despicable or contemptible; "only a rotter would do that"; "kill the rat"; "throw the bum out"; "you cowardly little pukes!"; "the British call a contemptible person a 'git'" `);
  const doc = nlp(text);
  return doc.json()[0].terms.filter(p => p.tags.includes('Noun') && !p.tags.includes('Pronoun')).map(p => p.text);
}
function getAdjectives(text) {
  // doc=nlp(`a person who is deemed to be despicable or contemptible; "only a rotter would do that"; "kill the rat"; "throw the bum out"; "you cowardly little pukes!"; "the British call a contemptible person a 'git'" `);
  const doc = nlp(text);
  return doc.json()[0].terms.filter(p => p.tags.includes('Adjective') && !p.tags.includes('Comparable')).map(p => p.text);
}
function getInfinitiveVerbs(text) {
  // doc=nlp(`a person who is deemed to be despicable or contemptible; "only a rotter would do that"; "kill the rat"; "throw the bum out"; "you cowardly little pukes!"; "the British call a contemptible person a 'git'" `);
  const doc = nlp(text);
  return doc.json()[0].terms.filter(p => p.tags.includes('Verb') && p.tags.includes('Infinitive')).map(p => p.text);
}