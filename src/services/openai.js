import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
})

/**
 * OpenAI service for generating legal guidance and scripts
 */
export const aiService = {
  /**
   * Generate state-specific legal rights information
   * @param {string} state - State name
   * @param {string} interactionType - Type of interaction
   * @param {string} language - Language code (en, es)
   * @returns {Promise<{content: Object, error: any}>}
   */
  async generateRightsGuide(state, interactionType, language = 'en') {
    try {
      const prompt = `Generate comprehensive legal rights information for a ${interactionType} in ${state}. 
      
      Please provide:
      1. A list of 5-7 specific "DO" recommendations
      2. A list of 5-7 specific "DON'T" warnings
      3. A brief summary (2-3 sentences) of key rights
      4. Detailed information about relevant laws and procedures
      
      Language: ${language === 'es' ? 'Spanish' : 'English'}
      
      Format the response as JSON with the following structure:
      {
        "dos": ["action1", "action2", ...],
        "donts": ["warning1", "warning2", ...],
        "summary": "Brief summary text",
        "detailedInfo": "Detailed legal information"
      }
      
      Focus on practical, actionable advice that citizens can use during real interactions with law enforcement.`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal expert specializing in civil rights and police interactions. Provide accurate, practical legal guidance based on current laws."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })

      const content = JSON.parse(completion.choices[0].message.content)
      return { content, error: null }
    } catch (error) {
      console.error('Error generating rights guide:', error)
      return { content: null, error }
    }
  },

  /**
   * Generate scripted responses for specific scenarios
   * @param {string} scenario - Specific scenario name
   * @param {string} state - State name
   * @param {string} language - Language code (en, es)
   * @returns {Promise<{scripts: Array, error: any}>}
   */
  async generateScripts(scenario, state, language = 'en') {
    try {
      const prompt = `Generate 3-5 scripted responses for the scenario: "${scenario}" in ${state}.
      
      Each script should be:
      - Polite and respectful
      - Legally sound
      - Easy to remember and say under stress
      - Appropriate for the specific scenario
      
      Language: ${language === 'es' ? 'Spanish' : 'English'}
      
      Format as JSON array:
      [
        {
          "purpose": "Brief description of when to use this script",
          "text": "The actual script text"
        }
      ]
      
      Focus on de-escalation and protecting the person's rights.`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal expert and communication specialist. Create scripts that help people communicate effectively with law enforcement while protecting their rights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1000
      })

      const scripts = JSON.parse(completion.choices[0].message.content)
      return { scripts, error: null }
    } catch (error) {
      console.error('Error generating scripts:', error)
      return { scripts: [], error }
    }
  },

  /**
   * Generate interaction summary for sharing
   * @param {Object} interactionData - Interaction details
   * @param {string} language - Language code (en, es)
   * @returns {Promise<{summary: string, error: any}>}
   */
  async generateInteractionSummary(interactionData, language = 'en') {
    try {
      const { interactionType, location, timestamp, notes, rightsExercised } = interactionData
      
      const prompt = `Generate a concise, professional summary of a police interaction for sharing with trusted contacts or legal counsel.
      
      Interaction Details:
      - Type: ${interactionType}
      - Location: ${location?.city || 'Unknown'}, ${location?.state || 'Unknown'}
      - Date/Time: ${new Date(timestamp).toLocaleString()}
      - Notes: ${notes || 'No additional notes'}
      - Rights Exercised: ${rightsExercised?.join(', ') || 'None specified'}
      
      Language: ${language === 'es' ? 'Spanish' : 'English'}
      
      Create a summary that:
      1. States the basic facts clearly
      2. Mentions any rights that were exercised
      3. Is suitable for sharing with family, friends, or legal counsel
      4. Maintains a professional, factual tone
      
      Keep it under 200 words.`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal documentation specialist. Create clear, factual summaries of police interactions that can be shared with trusted contacts or legal professionals."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 300
      })

      const summary = completion.choices[0].message.content
      return { summary, error: null }
    } catch (error) {
      console.error('Error generating interaction summary:', error)
      return { summary: null, error }
    }
  },

  /**
   * Translate text to specified language
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<{translation: string, error: any}>}
   */
  async translateText(text, targetLanguage) {
    try {
      const languageName = targetLanguage === 'es' ? 'Spanish' : 'English'
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a professional translator specializing in legal and civil rights content. Translate accurately while maintaining the legal meaning and tone.`
          },
          {
            role: "user",
            content: `Translate the following text to ${languageName}:\n\n${text}`
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      })

      const translation = completion.choices[0].message.content
      return { translation, error: null }
    } catch (error) {
      console.error('Error translating text:', error)
      return { translation: null, error }
    }
  },

  /**
   * Get AI-powered recommendations based on interaction context
   * @param {Object} context - Interaction context
   * @returns {Promise<{recommendations: Array, error: any}>}
   */
  async getRecommendations(context) {
    try {
      const { interactionType, location, timeOfDay, circumstances } = context
      
      const prompt = `Based on the following interaction context, provide 3-5 specific recommendations:
      
      Context:
      - Interaction Type: ${interactionType}
      - Location: ${location?.state || 'Unknown'}
      - Time: ${timeOfDay || 'Unknown'}
      - Circumstances: ${circumstances || 'Standard interaction'}
      
      Provide practical, actionable recommendations that prioritize safety and legal protection.
      Format as a JSON array of strings.`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a civil rights expert providing safety and legal recommendations for police interactions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 400
      })

      const recommendations = JSON.parse(completion.choices[0].message.content)
      return { recommendations, error: null }
    } catch (error) {
      console.error('Error getting recommendations:', error)
      return { recommendations: [], error }
    }
  }
}

/**
 * Fallback content when AI service is unavailable
 */
export const fallbackContent = {
  /**
   * Get fallback rights guide for common scenarios
   * @param {string} interactionType 
   * @param {string} language 
   * @returns {Object}
   */
  getRightsGuide(interactionType, language = 'en') {
    const content = {
      en: {
        traffic_stop: {
          dos: [
            "Keep your hands visible on the steering wheel",
            "Remain calm and speak respectfully",
            "Provide license, registration, and insurance when requested",
            "Follow lawful orders",
            "Remember details of the interaction"
          ],
          donts: [
            "Don't make sudden movements",
            "Don't argue or become confrontational",
            "Don't consent to searches without a warrant",
            "Don't lie or provide false information",
            "Don't resist, even if you believe the stop is unlawful"
          ],
          summary: "During a traffic stop, remain calm, keep hands visible, and comply with lawful orders while exercising your constitutional rights.",
          detailedInfo: "You have the right to remain silent beyond providing required identification. You can refuse consent to search your vehicle unless officers have probable cause or a warrant."
        }
      },
      es: {
        traffic_stop: {
          dos: [
            "Mantenga las manos visibles en el volante",
            "Manténgase calmado y hable respetuosamente",
            "Proporcione licencia, registro y seguro cuando se lo soliciten",
            "Siga órdenes legales",
            "Recuerde los detalles de la interacción"
          ],
          donts: [
            "No haga movimientos bruscos",
            "No discuta o se vuelva confrontativo",
            "No consienta a registros sin una orden judicial",
            "No mienta o proporcione información falsa",
            "No se resista, incluso si cree que la parada es ilegal"
          ],
          summary: "Durante una parada de tráfico, manténgase calmado, mantenga las manos visibles y cumpla con las órdenes legales mientras ejerce sus derechos constitucionales.",
          detailedInfo: "Tiene derecho a permanecer en silencio más allá de proporcionar la identificación requerida. Puede rechazar el consentimiento para registrar su vehículo a menos que los oficiales tengan causa probable o una orden judicial."
        }
      }
    }

    return content[language]?.[interactionType] || content.en.traffic_stop
  }
}
