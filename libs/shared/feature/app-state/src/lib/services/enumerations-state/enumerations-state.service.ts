import { Injectable } from '@angular/core';
import { ConfiguredEnums, EnumMapType, IEnumData, IStandardEnum, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { Observable, ReplaySubject, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnumerationsStateService {
  private readonly _enumsSubject = new ReplaySubject<Map<string, Map<string, IEnumData>>>(1);
  private readonly _enums$ = this._enumsSubject.asObservable();

  constructor(private readonly _workApiRoutesService: WorkApiRoutesService) {}

  /**
   * Initialize the enumerations state.
   * This will fetch the enumerations from the API and store them in the internal state.
   */
  public initializeEnumerations() {
    this._workApiRoutesService
      .getEnumerations$()
      .pipe(
        tap((configuredEnums: ConfiguredEnums) => {
          const enumerationsMap = new Map<string, Map<string, IEnumData>>();
          for (const key in configuredEnums) {
            const innerMap = new Map<string, IEnumData>();
            configuredEnums[key].forEach((item: IStandardEnum) => {
              innerMap.set(item.value, { label: item.label, rank: item.rank });
            });
            enumerationsMap.set(key, innerMap);
          }
          this._enumsSubject.next(enumerationsMap);
        }),
      )
      .subscribe();
  }

  /**
   * Get the enum map for the given enum key.
   * ```ts
   * Example:
   * getEnumMap$(EnumMapType.DocumentRejectionReasons)
   *       .pipe(
   *         take(1),
   *         tap(reasons => {
   *           // Do something with the enum map
   *         }),
   *       )
   *       .subscribe();
   * ```
   * @param enumKey One of the EnumMapType defined values.
   * @returns Observable of the wanted enum map.
   */
  public getEnumMap$(enumKey: EnumMapType): Observable<Map<string, IEnumData>> {
    return this._enums$.pipe(
      map(enumsMap => {
        const childMap = enumsMap.get(enumKey);
        if (!childMap) {
          throw new Error(`Enum map not found for ${enumKey}`);
        }

        return childMap;
      }),
      catchError(_ => {
        return of(new Map<string, IEnumData>());
      }),
    );
  }

  /**
   * Get the value for the given enum key and value id.
   *
   * ```ts
   * Example:
   * this._enumService.getValueFromEnum$(EnumMapType.DocumentRejectionReasons, 'POOR_QUALITY')
   * .pipe(
   *  take(1),
   *  tap(reason => {
   * // Do something with the value
   * })).subscribe();
   * ```
   * @param enumKey One of the EnumMapType defined values.
   * @param id The id or key of the specific value to get.
   * @returns Observable of the wanted value.
   */
  public getDataFromEnum$(enumKey: EnumMapType, id: string): Observable<IEnumData> {
    return this._enums$.pipe(
      map(enumsMap => {
        const childMap = enumsMap.get(enumKey);

        const data = childMap?.get(id);

        if (data !== undefined) {
          return data;
        }

        throw new Error(`${id} does not exist in ${enumKey}`);
      }),
      catchError(_ => {
        return of({ label: `Undefined value for: ${id}` });
      }),
    );
  }

  /**
   * Clear the enumerations state.
   */
  public clearEnumsState(): void {
    this._enumsSubject.next(new Map<string, Map<string, IEnumData>>());
  }
}
