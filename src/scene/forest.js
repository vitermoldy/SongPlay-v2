import {
  ConeGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Quaternion,
  ShaderMaterial,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { forestDepth, heightAt } from './terrain.js';
import { NOISE_GLSL, col, mulberry32 } from './shared.js';

// The forest round the clearing: firs and broadleaf trees, with low bushes along the edge so the
// meadow runs into the wood instead of stopping at a wall. Every tree is one instance of one of
// two small meshes, one unit tall; its instance matrix gives it a place, a turn and a size.

