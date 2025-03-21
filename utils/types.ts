export type Empty = Record<string, never>

export type NativeProps<
  NativeElement extends keyof React.ReactHTML,
  OmittedKeys extends string | number | symbol | undefined = undefined
> = Omit<JSX.IntrinsicElements[NativeElement], OmittedKeys extends undefined ? 'ref' : 'ref' | OmittedKeys>
