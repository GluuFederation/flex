import {
  REGEX_TRAILING_PERIOD,
  REGEX_TRAILING_SLASH,
  REGEX_LEADING_SLASH,
  REGEX_FORWARD_SLASH,
  REGEX_LEADING_COLON,
  REGEX_SURROUNDING_QUOTES,
  REGEX_NON_SLUG_CHARS,
  REGEX_CONSECUTIVE_HYPHENS,
  REGEX_LEADING_TRAILING_HYPHENS,
  REGEX_CAMEL_TO_SNAKE_BOUNDARY,
  REGEX_CAMEL_CASE_WORD_BOUNDARY,
  REGEX_UPPERCASE_LETTER,
  REGEX_SPACE_OR_HYPHEN_SEQUENCE,
  REGEX_NON_ALPHANUMERIC_SEQUENCE,
  REGEX_CONSECUTIVE_WHITESPACE,
  REGEX_SEPARATOR_CHARS,
  REGEX_WHITESPACE_CHAR,
  REGEX_SCRIPT_EXTENSION,
  REGEX_NON_LOWERCASE_ALPHA,
  REGEX_BRACED_PLACEHOLDER,
  REGEX_URL_PLACEHOLDER,
  REGEX_PYTHON_PLACEHOLDER,
  REGEX_NO_WHITESPACE,
  REGEX_NO_WHITESPACE_STRICT,
  REGEX_IDENTIFIER,
  REGEX_HAS_UPPERCASE,
  REGEX_HAS_LOWERCASE,
  REGEX_HAS_DIGIT,
  REGEX_HAS_SPECIAL_CHAR,
  REGEX_DATE_YYYY_MM_DD,
  REGEX_HEX_COLOR,
  REGEX_CSV_FORMULA_INJECTION,
  REGEX_CSV_SPECIAL_CHARS,
  REGEX_DATE_SEPARATOR_CHARS,
  REGEX_AUDIT_LIST_TIMESTAMP,
  REGEX_HOURLY_AGGREGATION_PERIOD,
  REGEX_ISO_WEEK_PERIOD,
  REGEX_EMAIL,
  REGEX_WEBHOOK_URL,
  REGEX_CGNAT_IP_PREFIX,
  REGEX_PRIVATE_172_IP_PREFIX,
  REGEX_GRANT_TYPE_URN_PREFIX,
  REGEX_BASE64URL_MINUS,
  REGEX_BASE64URL_UNDERSCORE,
  regexForBracedKey,
  regexForOrvalMutationHook,
  regexForOrvalQueryHook,
  regexForOrvalHookDecl,
} from '@/utils/regex'

describe('string-stripping patterns', () => {
  it('REGEX_TRAILING_PERIOD strips only a trailing dot', () => {
    expect('done.'.replace(REGEX_TRAILING_PERIOD, '')).toBe('done')
    expect('a.b'.replace(REGEX_TRAILING_PERIOD, '')).toBe('a.b')
  })

  it('REGEX_TRAILING_SLASH strips a single trailing slash', () => {
    expect('https://x/'.replace(REGEX_TRAILING_SLASH, '')).toBe('https://x')
    expect('no-slash'.replace(REGEX_TRAILING_SLASH, '')).toBe('no-slash')
  })

  it('REGEX_LEADING_SLASH strips a leading slash', () => {
    expect('/key'.replace(REGEX_LEADING_SLASH, '')).toBe('key')
    expect('key'.replace(REGEX_LEADING_SLASH, '')).toBe('key')
  })

  it('REGEX_FORWARD_SLASH replaces every slash globally', () => {
    expect('a/b/c'.replace(REGEX_FORWARD_SLASH, '.')).toBe('a.b.c')
  })

  it('REGEX_LEADING_COLON strips a leading colon', () => {
    expect(':id'.replace(REGEX_LEADING_COLON, '')).toBe('id')
  })

  it('REGEX_SURROUNDING_QUOTES strips surrounding double quotes', () => {
    expect('"value"'.replace(REGEX_SURROUNDING_QUOTES, '')).toBe('value')
  })
})

describe('slug / casing patterns', () => {
  it('REGEX_NON_SLUG_CHARS removes invalid slug characters', () => {
    expect('a b!c'.replace(REGEX_NON_SLUG_CHARS, '')).toBe('abc')
  })

  it('REGEX_CONSECUTIVE_HYPHENS collapses runs of hyphens', () => {
    expect('a---b'.replace(REGEX_CONSECUTIVE_HYPHENS, '-')).toBe('a-b')
  })

  it('REGEX_LEADING_TRAILING_HYPHENS trims edge hyphens', () => {
    expect('--abc--'.replace(REGEX_LEADING_TRAILING_HYPHENS, '')).toBe('abc')
  })

  it('REGEX_CAMEL_TO_SNAKE_BOUNDARY inserts boundary for camelCase', () => {
    expect('fooBar'.replace(REGEX_CAMEL_TO_SNAKE_BOUNDARY, '$1_$2')).toBe('foo_Bar')
    expect('foo2Bar'.replace(REGEX_CAMEL_TO_SNAKE_BOUNDARY, '$1_$2')).toBe('foo2_Bar')
  })

  it('REGEX_CAMEL_CASE_WORD_BOUNDARY inserts boundary between letters only', () => {
    expect('fooBar'.replace(REGEX_CAMEL_CASE_WORD_BOUNDARY, '$1-$2')).toBe('foo-Bar')
  })

  it('REGEX_UPPERCASE_LETTER prefixes each capital', () => {
    expect('fooBar'.replace(REGEX_UPPERCASE_LETTER, ' $1')).toBe('foo Bar')
  })

  it('REGEX_SPACE_OR_HYPHEN_SEQUENCE normalizes separators to underscores', () => {
    expect('a - b'.replace(REGEX_SPACE_OR_HYPHEN_SEQUENCE, '_')).toBe('a_b')
  })

  it('REGEX_NON_ALPHANUMERIC_SEQUENCE compacts non-alphanumeric runs', () => {
    expect('a.. b!!c'.replace(REGEX_NON_ALPHANUMERIC_SEQUENCE, '_')).toBe('a_b_c')
  })

  it('REGEX_CONSECUTIVE_WHITESPACE collapses whitespace', () => {
    expect('a   b\t c'.replace(REGEX_CONSECUTIVE_WHITESPACE, ' ')).toBe('a b c')
  })

  it('REGEX_SEPARATOR_CHARS splits on underscore or hyphen runs', () => {
    expect('foo_bar-baz'.split(REGEX_SEPARATOR_CHARS)).toEqual(['foo', 'bar', 'baz'])
    expect('foo__bar'.split(REGEX_SEPARATOR_CHARS)).toEqual(['foo', 'bar'])
  })

  it('REGEX_WHITESPACE_CHAR converts whitespace to underscores', () => {
    expect('a b c'.replace(REGEX_WHITESPACE_CHAR, '_')).toBe('a_b_c')
  })

  it('REGEX_SCRIPT_EXTENSION strips script extensions', () => {
    expect('mod.tsx'.replace(REGEX_SCRIPT_EXTENSION, '')).toBe('mod')
    expect('mod.js'.replace(REGEX_SCRIPT_EXTENSION, '')).toBe('mod')
    expect('mod.css'.replace(REGEX_SCRIPT_EXTENSION, '')).toBe('mod.css')
  })

  it('REGEX_NON_LOWERCASE_ALPHA removes non lowercase letters', () => {
    expect('a1B-c'.replace(REGEX_NON_LOWERCASE_ALPHA, '')).toBe('ac')
  })
})

describe('placeholder patterns', () => {
  it('REGEX_BRACED_PLACEHOLDER finds braced placeholders', () => {
    expect('{a} and {b.c}'.match(REGEX_BRACED_PLACEHOLDER)).toEqual(['{a}', '{b.c}'])
  })

  it('REGEX_URL_PLACEHOLDER matches shortcode placeholders', () => {
    expect('/x/${inum}/y'.replace(REGEX_URL_PLACEHOLDER, 'ID')).toBe('/x/ID/y')
  })

  it('REGEX_PYTHON_PLACEHOLDER detects un-substituted templates', () => {
    expect(REGEX_PYTHON_PLACEHOLDER.test('%(key)s')).toBe(true)
    expect(REGEX_PYTHON_PLACEHOLDER.test('plain')).toBe(false)
  })

  it('regexForBracedKey matches the given key only and escapes metacharacters', () => {
    expect('{name} {other}'.replace(regexForBracedKey('name'), 'X')).toBe('X {other}')
    expect('{a.b}'.replace(regexForBracedKey('a.b'), 'X')).toBe('X')
    expect('{axb}'.replace(regexForBracedKey('a.b'), 'X')).toBe('{axb}')
  })
})

describe('validation patterns', () => {
  it('REGEX_NO_WHITESPACE allows empty and no-whitespace strings', () => {
    expect(REGEX_NO_WHITESPACE.test('')).toBe(true)
    expect(REGEX_NO_WHITESPACE.test('abc')).toBe(true)
    expect(REGEX_NO_WHITESPACE.test('a b')).toBe(false)
  })

  it('REGEX_NO_WHITESPACE_STRICT requires non-empty no-whitespace', () => {
    expect(REGEX_NO_WHITESPACE_STRICT.test('')).toBe(false)
    expect(REGEX_NO_WHITESPACE_STRICT.test('abc')).toBe(true)
  })

  it('REGEX_IDENTIFIER allows alphanumeric and underscore only', () => {
    expect(REGEX_IDENTIFIER.test('foo_bar1')).toBe(true)
    expect(REGEX_IDENTIFIER.test('foo-bar')).toBe(false)
    expect(REGEX_IDENTIFIER.test('')).toBe(false)
  })

  it('password strength patterns detect their character class', () => {
    expect(REGEX_HAS_UPPERCASE.test('aA')).toBe(true)
    expect(REGEX_HAS_UPPERCASE.test('ab')).toBe(false)
    expect(REGEX_HAS_LOWERCASE.test('Ab')).toBe(true)
    expect(REGEX_HAS_LOWERCASE.test('AB')).toBe(false)
    expect(REGEX_HAS_DIGIT.test('a1')).toBe(true)
    expect(REGEX_HAS_DIGIT.test('ab')).toBe(false)
    expect(REGEX_HAS_SPECIAL_CHAR.test('a!')).toBe(true)
    expect(REGEX_HAS_SPECIAL_CHAR.test('ab')).toBe(false)
  })

  it('REGEX_DATE_YYYY_MM_DD validates the date shape', () => {
    expect(REGEX_DATE_YYYY_MM_DD.test('2026-01-15')).toBe(true)
    expect(REGEX_DATE_YYYY_MM_DD.test('2026/01/15')).toBe(false)
  })

  it('REGEX_HEX_COLOR captures RGB pairs', () => {
    const match = 'ff0080'.match(REGEX_HEX_COLOR)
    expect(match?.slice(1)).toEqual(['ff', '00', '80'])
    expect('#ABCDEF'.match(REGEX_HEX_COLOR)).not.toBeNull()
    expect('xyz'.match(REGEX_HEX_COLOR)).toBeNull()
  })

  it('REGEX_EMAIL validates email surface form', () => {
    expect(REGEX_EMAIL.test('a@b.com')).toBe(true)
    expect(REGEX_EMAIL.test('a@b')).toBe(true)
    expect(REGEX_EMAIL.test('no-at-sign')).toBe(false)
  })

  it('REGEX_WEBHOOK_URL validates https webhook urls', () => {
    expect(REGEX_WEBHOOK_URL.test('https://example.com/hook')).toBe(true)
    expect(REGEX_WEBHOOK_URL.test('http://example.com')).toBe(false)
    expect(REGEX_WEBHOOK_URL.test('https://host.example.com:8443/p?q=1#h')).toBe(true)
  })
})

describe('csv patterns', () => {
  it('REGEX_CSV_FORMULA_INJECTION detects leading formula characters', () => {
    expect(REGEX_CSV_FORMULA_INJECTION.test('=1+1')).toBe(true)
    expect(REGEX_CSV_FORMULA_INJECTION.test('@cmd')).toBe(true)
    expect(REGEX_CSV_FORMULA_INJECTION.test('safe')).toBe(false)
  })

  it('REGEX_CSV_SPECIAL_CHARS detects characters requiring quoting', () => {
    expect(REGEX_CSV_SPECIAL_CHARS.test('a,b')).toBe(true)
    expect(REGEX_CSV_SPECIAL_CHARS.test('a"b')).toBe(true)
    expect(REGEX_CSV_SPECIAL_CHARS.test('clean')).toBe(false)
  })

  it('REGEX_DATE_SEPARATOR_CHARS normalizes datetime separators', () => {
    expect('2026/01/15, 10:30'.replace(REGEX_DATE_SEPARATOR_CHARS, '-')).toBe('2026-01-15- 10-30')
  })
})

describe('aggregation period patterns', () => {
  it('REGEX_AUDIT_LIST_TIMESTAMP captures timestamp and content', () => {
    const m = '15-01-2026 10:30:45.123 did a thing'.match(REGEX_AUDIT_LIST_TIMESTAMP)
    expect(m?.[1]).toBe('15-01-2026 10:30:45.123')
    expect(m?.[2]).toBe('did a thing')
  })

  it('REGEX_HOURLY_AGGREGATION_PERIOD captures date and hour', () => {
    const m = '2026-05-11-9'.match(REGEX_HOURLY_AGGREGATION_PERIOD)
    expect(m?.[1]).toBe('2026-05-11')
    expect(m?.[2]).toBe('9')
  })

  it('REGEX_ISO_WEEK_PERIOD captures year and week', () => {
    const m = '2026-W19'.match(REGEX_ISO_WEEK_PERIOD)
    expect(m?.[1]).toBe('2026')
    expect(m?.[2]).toBe('19')
  })
})

describe('ip / urn patterns', () => {
  it('REGEX_CGNAT_IP_PREFIX captures the second octet', () => {
    expect('100.64.0.1'.match(REGEX_CGNAT_IP_PREFIX)?.[1]).toBe('64')
    expect(REGEX_CGNAT_IP_PREFIX.test('10.0.0.1')).toBe(false)
  })

  it('REGEX_PRIVATE_172_IP_PREFIX captures the second octet', () => {
    expect('172.16.0.1'.match(REGEX_PRIVATE_172_IP_PREFIX)?.[1]).toBe('16')
  })

  it('REGEX_GRANT_TYPE_URN_PREFIX strips the urn prefix', () => {
    expect(
      'urn:ietf:params:oauth:grant-type:device_code'.replace(REGEX_GRANT_TYPE_URN_PREFIX, ''),
    ).toBe('device_code')
  })
})

describe('base64url patterns', () => {
  it('REGEX_BASE64URL_MINUS and underscore convert to standard base64', () => {
    expect(
      'a-b_c'.replace(REGEX_BASE64URL_MINUS, '+').replace(REGEX_BASE64URL_UNDERSCORE, '/'),
    ).toBe('a+b/c')
  })
})

describe('orval hook regex factories', () => {
  it('regexForOrvalMutationHook matches a hook wired to useMutation', () => {
    const code = 'export const useDoThing = () => {\n  return useMutation(opts)\n}'
    expect(regexForOrvalMutationHook('useDoThing').test(code)).toBe(true)
  })

  it('regexForOrvalQueryHook matches a hook wired to useQuery', () => {
    const code = 'export const useGetThing = () => {\n  return useQuery(opts)\n}'
    expect(regexForOrvalQueryHook('useGetThing').test(code)).toBe(true)
  })

  it('regexForOrvalHookDecl matches the declaration alone', () => {
    expect(regexForOrvalHookDecl('useGetThing').test('export const useGetThing = () => {}')).toBe(
      true,
    )
    expect(regexForOrvalHookDecl('useGetThing').test('export const useOther = () => {}')).toBe(
      false,
    )
  })
})
