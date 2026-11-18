const descriptions = {
  "human:inspiration": "Gain Heroic Inspiration when you finish a Long Rest.",
  "human:skill": "Choose one skill to gain Training in during character creation.",
  "human:origin-feat": "Choose an additional Origin feat and complete any choices it grants.",
  "fishmen:breathing": "Breathe both air and water.",
  "fishmen:darkvision": "See in darkness within 60 feet.",
  "fishmen:cold-resistance": "Take half damage from Cold damage.",
  "fishmen:current-speech": "Convey simple ideas to Beasts, Elementals, and Monstrosities that have a Swim Speed.",
  "fishmen:innate-spells": "Unlock Fog Cloud, Gust of Wind, and Water Walk at character levels 1, 3, and 5. Each unlock grants one free cast per Long Rest. You can also use an appropriate spell slot.",
  "stoneborn:darkvision": "See in darkness within 120 feet.",
  "stoneborn:poison-defense": "Gain Poison resistance and Advantage on saves to avoid or end the Poisoned condition.",
  "stoneborn:health": "Increase your maximum Health by 1 for each character level.",
  "stoneborn:stone-listening": "Use a Bonus Action to gain Tremorsense out to 60 feet for 10 minutes while in contact with stone. Uses equal your Training Bonus and refresh on a Long Rest.",
  "fey-touched:reverie": "Finish a Long Rest in four hours of conscious reverie. You do not need sleep and magic cannot put you to sleep.",
  "fey-touched:charmed-defense": "Gain Advantage on saves to avoid or end the Charmed condition.",
  "fey-touched:skill": "Gain Training in your choice of Insight, Perception, or Survival.",
  "fey-touched:innate-spells": "Your heritage grants a cantrip at level 1 and additional spells at levels 3 and 5. Each leveled spell can be cast once per Long Rest without a slot, or with an appropriate slot.",
  "beastshifters:skill": "Gain Training in your choice of Acrobatics, Athletics, Intimidation, or Survival.",
  "beastshifters:transform": "Use a Bonus Action and one Animal Form use to enter a known animal form. Uses refresh on a Long Rest.",
  "beastshifters:revert": "Use a Bonus Action to return to your usual form.",
  "beastshifters:primal-recovery": "While transformed, use a Bonus Action and spend one Hit Die to restore Health to your animal form.",
  "changelings:skills": "Choose two skills to gain Training in from Deception, Insight, Intimidation, Performance, and Persuasion.",
  "changelings:shapechange": "Use an Action to change your appearance and voice. You can appear Small or Medium with the same arrangement of limbs. The change lasts until you change again and leaves your gear and creature type as they are."
};

export const lineageTraitText = trait => trait.description ?? trait.summary ?? descriptions[trait.id.slice(8)];
