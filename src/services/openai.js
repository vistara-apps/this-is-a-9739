import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
})

export const generateRightsGuide = async (state, interactionType, language = 'en') => {
  try {
    const prompt = `Generate a comprehensive rights guide for a ${interactionType} in ${state}. 
    Language: ${language === 'es' ? 'Spanish' : 'English'}
    
    Return a JSON object with the following structure:
    {
      "dos": ["array of 5-7 things to do"],
      "donts": ["array of 5-7 things not to do"],
      "summary": "brief 2-3 sentence summary",
      "detailedInfo": "detailed paragraph with state-specific legal information"
    }
    
    Focus on constitutional rights, state-specific laws, and practical safety advice.`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a legal expert specializing in civil rights and police interactions. Provide accurate, helpful, and legally sound advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const content = response.choices[0].message.content
    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating rights guide:', error)
    throw error
  }
}

export const generateScripts = async (scenario, state, language = 'en') => {
  try {
    const prompt = `Generate scripted responses for the scenario: "${scenario}" in ${state}.
    Language: ${language === 'es' ? 'Spanish' : 'English'}
    
    Return a JSON array of script objects with this structure:
    [
      {
        "purpose": "description of when to use this script",
        "text": "the actual script text to say"
      }
    ]
    
    Generate 3-5 different scripts for various situations within this scenario.
    Focus on asserting rights while remaining respectful and safe.`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a legal expert helping people navigate police interactions safely and legally. Provide clear, respectful scripts that assert constitutional rights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    })

    const content = response.choices[0].message.content
    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating scripts:', error)
    throw error
  }
}

export const generateInteractionSummary = async (interactionData, language = 'en') => {
  try {
    const prompt = `Generate a professional summary of this police interaction:
    
    Type: ${interactionData.interaction_type}
    Location: ${interactionData.location_city}, ${interactionData.location_state}
    Date: ${new Date(interactionData.timestamp).toLocaleDateString()}
    Notes: ${interactionData.notes || 'No additional notes'}
    Rights Exercised: ${interactionData.rights_exercised?.join(', ') || 'None specified'}
    
    Language: ${language === 'es' ? 'Spanish' : 'English'}
    
    Create a clear, factual summary that could be shared with legal counsel or trusted contacts.
    Include key details, timeline, and any rights that were exercised.
    Keep it professional and objective.`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a legal assistant creating professional summaries of police interactions. Be factual, clear, and objective.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('Error generating interaction summary:', error)
    throw error
  }
}

export default openai
