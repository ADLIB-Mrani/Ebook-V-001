import unittest
from local_ai_planner import get_context, validate_response, build_prompt

class LocalAiTests(unittest.TestCase):
    def test_grounded_local_suggestions_only(self):
        plan={'schema':2,'profile':{'goal':'Apprendre Python','level':'debutant',
              'hoursPerWeek':5},'weeks':[{'tasks':[{'id':'w1-t0','title':'Faire un exercice',
              'completed':False,'description':'Pratiquer','evidence':'exercice terminé'}]}]}
        a={'schema':'regroupement-extraction-v1','dry_run':True,'executed':False,
           'resources':[{'url':'https://docs.python.org/fr/3/','title':'Python docs',
             'status':'extrait-non-verifie','excerpt':'Documentation Python'}]}
        context,tasks,sources=get_context(a,plan)
        self.assertEqual(len(tasks),1)
        self.assertEqual(len(sources),1)
        self.assertIn('sources' ,build_prompt(context)[-1]['content'].lower())
        raw={'suggestions':[{'task_id':'w1-t0','advice':'Écrire trois fonctions testables et conserver le résultat.',
             'reason':'livrable vérifiable','source_urls':['https://docs.python.org/fr/3/',
                        'https://evil.test/not-in-corpus']} ]}
        output=validate_response(raw,context,tasks,sources,'qwen2.5:3b')
        self.assertFalse(output['approved'])
        self.assertFalse(output['executed'])
        self.assertTrue(output['dry_run'])
        self.assertEqual(len(output['suggestions'][0]['sourceUrls']),1)
    def test_invalid_injection_context(self):
        plan={'schema':2,'profile':{'goal':'Un objectif'},'weeks':[{'tasks':[{'id':'t1','completed':False}]}]}
        bad={'schema':'regroupement-extraction-v1','dry_run':False,'executed':True,'resources':[]}
        with self.assertRaises(ValueError):get_context(bad,plan)

if __name__=='__main__': unittest.main()
