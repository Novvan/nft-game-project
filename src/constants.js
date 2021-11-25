const CONTRACT_ADDRESS = '0x43410Da3b57D99A77Bba2D2F5990A74Dd4D1c32A';

const transformCharacterData = (characterData, isBoss=false) => {
  if(isBoss){
    return {
      name: characterData.name,
      imageURI: characterData.imageURI,
      hp: characterData.hp.toNumber(),
      maxHp: characterData.maxHp.toNumber(),
      attackDamage: characterData.attackDamage.toNumber(),
    };
  }else{
    return {
      name: characterData.name,
      imageURI: characterData.imageURI,
      hp: characterData.hp.toNumber(),
      maxHp: characterData.maxHp.toNumber(),
      mana: characterData.mana.toNumber(),
      maxMana: characterData.maxMana.toNumber(),
      spellDamage: characterData.spellDamage.toNumber(),
    };
  }
};

export { CONTRACT_ADDRESS, transformCharacterData };